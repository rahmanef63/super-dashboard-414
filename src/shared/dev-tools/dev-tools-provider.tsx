"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { DevTools } from "./dev-tools"

// Define the User interface
export interface User {
  id: string;
  email: string | null; // Allow email to be null
  role: UserRole;
}

// Define UserRole type
export type UserRole = "user" | "admin" | "guest";

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
}

interface SessionData {
  userId?: string
  username?: string
  email?: string | null
  role: UserRole
  isAuthenticated: boolean
  lastActive: Date
  preferences: Record<string, any>
}

interface DevToolsContextType {
  isOpen: boolean
  toggleDevTools: () => void
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  logs: LogEntry[]
  clearLogs: () => void
  session: SessionData
  updateSession: (data: Partial<SessionData>) => void
  availableUsers: User[] // Add state for fetched users
  isLoadingUsers: boolean // Add loading state
}

const DevToolsContext = createContext<DevToolsContextType | undefined>(undefined)

// Define a default guest user
export const GUEST_USER: User = {
    id: "guest-0",
    email: "guest@example.com",
    role: "guest"
};

const DEFAULT_SESSION: SessionData = {
  role: "guest",
  isAuthenticated: false,
  lastActive: new Date(),
  preferences: {},
}

export function useDevTools() {
  const context = useContext(DevToolsContext)
  if (context === undefined) {
    throw new Error("useDevTools must be used within a DevToolsProvider")
  }
  return context
}

export function DevToolsProvider({ children }: { children: React.ReactNode }) {
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue
    try {
      const stored = localStorage.getItem(`devtools:${key}`)
      if (key === 'session' && stored) {
        const parsed = JSON.parse(stored);
        return { ...parsed, lastActive: new Date(parsed.lastActive) } as T;
      }
      if (key === 'currentUser' && stored) {
         const parsed = JSON.parse(stored);
         // Ensure backwards compatibility if role is missing or email is undefined
         return {
           ...parsed,
           email: parsed.email ?? null,
           role: parsed.role || 'guest'
          } as T;
      }
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const saveToStorage = <T,>(key: string, value: T): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(`devtools:${key}`, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  const [isOpen, setIsOpen] = useState(() => loadFromStorage("isOpen", false))
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage<User | null>("currentUser", GUEST_USER))
  const [isDarkMode, setIsDarkMode] = useState(() => loadFromStorage("isDarkMode", false))
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [session, setSession] = useState<SessionData>(() => {
    const loadedSession = loadFromStorage("session", DEFAULT_SESSION);
    return { ...loadedSession, lastActive: new Date(loadedSession.lastActive) };
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([GUEST_USER]); // Start with guest
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const pendingLogsRef = useRef<LogEntry[]>([])
  const isProcessingLogsRef = useRef(false)
  const originalConsoleRef = useRef<any>(null)
  const consoleOverrideActiveRef = useRef(false)

  const toggleDevTools = () => {
    const newValue = !isOpen
    setIsOpen(newValue)
    saveToStorage("isOpen", newValue)
  }

  const toggleDarkMode = () => {
    const newValue = !isDarkMode
    setIsDarkMode(newValue)
    saveToStorage("isDarkMode", newValue)
    if (newValue) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const clearLogs = () => setLogs([])

  const updateSession = (data: Partial<SessionData>) => {
    setSession((prevSession) => {
      const updatedSession = { ...prevSession, ...data, lastActive: new Date() }
      saveToStorage("session", updatedSession)
      if (Object.keys(data).length > 0) {
          addLogSafely("info", "Session updated", data)
      }
      return updatedSession
    });
  }

  const addLogSafely = (level: LogLevel, message: string, data?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message: typeof message === "object" ? JSON.stringify(message) : String(message),
      data,
    }
    pendingLogsRef.current.push(newLog)
    if (!isProcessingLogsRef.current) {
      processPendingLogs()
    }
  }

  const processPendingLogs = () => {
    if (pendingLogsRef.current.length === 0) {
      isProcessingLogsRef.current = false
      return
    }
    isProcessingLogsRef.current = true
    setTimeout(() => {
      const logsToAdd = [...pendingLogsRef.current]
      pendingLogsRef.current = []
      setLogs((prevLogs) => [...logsToAdd, ...prevLogs].slice(0, 100))
      if (pendingLogsRef.current.length > 0) {
        processPendingLogs()
      } else {
        isProcessingLogsRef.current = false
      }
    }, 0)
  }

  // Fetch users on mount (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsLoadingUsers(true);
      fetch('/api/dev/users')
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.statusText}`);
          }
          return res.json();
        })
        .then((users: User[]) => {
           // Validate and ensure roles are correct UserRole type
           const validUsers = users.filter(u => ['user', 'admin', 'guest'].includes(u.role));
           // Ensure guest user is always present and unique
           const uniqueUsers = [GUEST_USER, ...validUsers.filter(u => u.id !== GUEST_USER.id)];
           setAvailableUsers(uniqueUsers);
           addLogSafely("info", `Fetched ${validUsers.length} users for dev tools.`);
        })
        .catch(error => {
          console.error("Error fetching users for dev tools:", error);
          addLogSafely("error", "Failed to fetch users for dev tools", { error: error.message });
          // Keep GUEST_USER in the list even if fetch fails
          setAvailableUsers([GUEST_USER]);
        })
        .finally(() => {
          setIsLoadingUsers(false);
        });
    }
  }, []); // Fetch only once on mount


  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialDarkMode = loadFromStorage("isDarkMode", prefersDark)
    setIsDarkMode(initialDarkMode)
    if (initialDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
       document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault()
        toggleDevTools()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, toggleDevTools])

  useEffect(() => {
    saveToStorage("currentUser", currentUser)
    updateSession({
      userId: currentUser?.id,
      email: currentUser?.email,
      role: currentUser?.role || "guest",
      isAuthenticated: currentUser?.role !== "guest",
    })
  }, [currentUser])

  useEffect(() => {
    if (!originalConsoleRef.current) {
      originalConsoleRef.current = {
        log: console.log, warn: console.warn, error: console.error, debug: console.debug,
      }
    }
    if (isOpen && !consoleOverrideActiveRef.current) {
      console.log = (...args: any[]) => { addLogSafely("info", args[0], args.slice(1)); originalConsoleRef.current?.log(...args); };
      console.warn = (...args: any[]) => { addLogSafely("warn", args[0], args.slice(1)); originalConsoleRef.current?.warn(...args); };
      console.error = (...args: any[]) => { addLogSafely("error", args[0], args.slice(1)); originalConsoleRef.current?.error(...args); };
      console.debug = (...args: any[]) => { addLogSafely("debug", args[0], args.slice(1)); originalConsoleRef.current?.debug(...args); };
      consoleOverrideActiveRef.current = true
      originalConsoleRef.current?.log("🛠️ Dev Tools activated")
    } else if (!isOpen && consoleOverrideActiveRef.current) {
      if (originalConsoleRef.current) {
          console.log = originalConsoleRef.current.log
          console.warn = originalConsoleRef.current.warn
          console.error = originalConsoleRef.current.error
          console.debug = originalConsoleRef.current.debug
      }
      consoleOverrideActiveRef.current = false
    }
    return () => {
      if (consoleOverrideActiveRef.current && originalConsoleRef.current) {
        console.log = originalConsoleRef.current.log
        console.warn = originalConsoleRef.current.warn
        console.error = originalConsoleRef.current.error
        console.debug = originalConsoleRef.current.debug
        consoleOverrideActiveRef.current = false
      }
    }
  }, [isOpen])

  useEffect(() => {
    const interval = setInterval(() => {
        if(session) { updateSession({}) }
    }, 60000)
    return () => clearInterval(interval)
  }, [session, updateSession])

  return (
    <DevToolsContext.Provider
      value={{
        isOpen,
        toggleDevTools,
        currentUser,
        setCurrentUser,
        isDarkMode,
        toggleDarkMode,
        logs,
        clearLogs,
        session,
        updateSession,
        availableUsers, // Provide fetched users
        isLoadingUsers, // Provide loading state
      }}
    >
      {children}
      <DevTools />
    </DevToolsContext.Provider>
  )
}
