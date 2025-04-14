"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession as useNextAuthSession, SessionContext as NextAuthSessionContext } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { Session as NextAuthSessionType } from "next-auth"; // Import base Session type

// Define our custom user shape expected within the session
interface CustomUser {
  id?: string; // Make id optional as it might not always be present
  name?: string | null;
  email?: string | null;
  role?: UserRole | string; // Allow string for flexibility if role comes differently
  // Add other custom fields if they exist in your session callback
}

// Extend the base NextAuth Session type
interface CustomSession extends NextAuthSessionType {
  user?: CustomUser;
  // Add other custom session fields if they exist (e.g., accessToken)
}

export type UserRole = "user" | "admin" | "manager" | "guest"

export interface UserSession {
  userId?: string
  username?: string
  email?: string
  role: UserRole
  isAuthenticated: boolean
  lastActive: Date
  preferences: Record<string, any>
  // Removed token/expiry fields as they weren't in the logic
}

interface SessionContextType {
  session: UserSession
  isLoading: boolean
}

const DEFAULT_SESSION: UserSession = {
  role: "guest",
  isAuthenticated: false,
  lastActive: new Date(),
  preferences: { theme: "light", notifications: true },
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Explicitly type the session data using our CustomSession
  const { data: sessionData, status } = useNextAuthSession() as { data: CustomSession | null; status: 'loading' | 'authenticated' | 'unauthenticated' };

  let userSession: UserSession = DEFAULT_SESSION;

  if (status === "authenticated" && sessionData?.user) {
      const nextAuthUser = sessionData.user;
      userSession = {
          userId: nextAuthUser.id, // Now TS should recognize id
          email: nextAuthUser.email ?? undefined,
          username: nextAuthUser.name ?? nextAuthUser.email?.split("@")[0] ?? undefined,
          // Safely assert role or provide default. Ensure 'role' IS added in your session callback if needed.
          role: (nextAuthUser.role as UserRole) ?? "user", 
          isAuthenticated: true,
          lastActive: new Date(),
          preferences: { theme: "light", notifications: true }, // Consider loading preferences
      }
  }

  // Log only when the userSession changes to avoid excessive logging
  useEffect(() => {
    console.log("Current session state:", userSession);
  }, [userSession]);

  return (
    <SessionContext.Provider
      value={{
        session: userSession,
        isLoading: status === "loading",
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

// Important: You also need to augment the NextAuth types globally
// Create a file like `types/next-auth.d.ts` with contents similar to:
/*
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      role?: string; // Or your UserRole type
    } & DefaultSession['user'];
  }

  interface User {
    role?: string; // Or your UserRole type
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string; // Or your UserRole type
  }
}
*/
