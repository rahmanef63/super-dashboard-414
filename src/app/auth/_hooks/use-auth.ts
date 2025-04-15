"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string | null; // Added image field
}

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [localLoading, setLocalLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || session.user.sub || "unknown-id",
        email: session.user.email!,
        name: session.user.name || session.user.username,
        image: session.user.image, // Map image from session
      })
    } else {
      setUser(null)
    }
  }, [session])

  const isLoading = status === "loading" || localLoading;

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLocalLoading(true)
        setError(null)
        const result = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        })
        if (result?.error) {
          throw new Error(result.error || "Invalid credentials")
        }
      } catch (err) {
        console.error("Login error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to login"
        setError(new Error(errorMessage))
      } finally {
        setLocalLoading(false)
      }
    },
    [],
  )

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        setLocalLoading(true)
        setError(null)
        await api.post("/auth/register", { email, password, name })
        await login(email, password);
      } catch (err) {
        console.error("Registration error:", err)
        setError(err instanceof Error ? err : new Error("Failed to register"))
      } finally {
        setLocalLoading(false)
      }
    },
    [login],
  )

  const logout = useCallback(async () => {
    try {
      setLocalLoading(true)
      setError(null)
      await signOut({ redirect: false })
      router.push("/auth/login")
    } catch (err) {
      console.error("Logout error:", err)
      setError(err instanceof Error ? err : new Error("Failed to logout"))
    } finally {
      setLocalLoading(false)
    }
  }, [router])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLocalLoading(true)
      setError(null)
      await api.post("/auth/password-reset", { email })
    } catch (err) {
      console.error("Password reset error:", err)
      setError(err instanceof Error ? err : new Error("Failed to send password reset email"))
    } finally {
      setLocalLoading(false)
    }
  }, [])

  return {
    user,
    loading: isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
  }
}
