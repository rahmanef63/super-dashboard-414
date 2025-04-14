"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert" 
import { AlertCircle } from "lucide-react" 
import { signIn } from "next-auth/react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) 
    setIsLoading(true) // Set loading true

    const signInData = {
      email,
      password,
      redirect: false, // Handle redirect manually
    };

    try {
      console.log(`Attempting sign in for ${email}, redirect target: ${redirectTo}`); 
      // *** ADDED LOG ***
      console.log("Calling signIn with:", 'credentials', signInData);
      const result = await signIn('credentials', signInData);
      console.log("Sign-in Result:", result); 

      if (result?.error) {
        console.error("Sign-in error:", result.error);
        // Map common errors to user-friendly messages
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
        } else if (result.error === "Callback" || result.error === "Signin") {
           setError("Could not sign in. Please try again later.");
        } else {
          setError(result.error); // Show other errors directly (less ideal)
        }
      } else if (result?.ok) {
        console.log(`Sign-in successful, redirecting to: ${redirectTo}`);
        router.push(redirectTo);
        // Refresh might be needed if server components depend on session
        // router.refresh(); 
      } else {
        console.error("Sign-in failed with unknown status:", result);
        setError("An unknown error occurred during sign-in.");
      }
    } catch (err) {
      console.error("Sign-in component exception:", err);
      setError("An unexpected error occurred."); 
    } finally {
      setIsLoading(false); // Set loading false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isLoading} // Disable while loading
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isLoading} // Disable while loading
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}> 
        {isLoading ? "Signing in..." : "Sign in"} 
      </Button>
    </form>
  )
}
