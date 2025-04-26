"use client"

import React from "react";
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert" 
import { AlertCircle } from "lucide-react" 
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useToast } from "@/shared/styles/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) 
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const { toast } = useToast();

  // Log when the login form mounts
  React.useEffect(() => {
    console.log('[LoginForm] Component mounted: user is on the login form page/modal');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) 
    setIsLoading(true) 

    const signInData = {
      email,
      password,
      redirect: false, 
    };
    // Mask password for logging
    const maskedSignInData = { ...signInData, password: password ? '***' : undefined };
    console.log('[LoginForm] Submitting credentials to signIn:', maskedSignInData);

    try {
      const result = await signIn('credentials', signInData);
      console.log('[LoginForm] signIn result:', result);
      // Extra tracker: fetch session after signIn
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        console.log('[LoginForm] Session after signIn:', session);
      } catch (err) {
        console.error('[LoginForm] Error fetching session after signIn:', err);
      }
      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else if (result.error === "Callback" || result.error === "Signin") {
          setError("Could not sign in. Please try again later.");
          toast({
            title: "Login Error",
            description: "Could not sign in. Please try again later.",
            variant: "destructive",
          });
        } else {
          setError(result.error);
          toast({
            title: "Login Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } else if (result?.ok) {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        router.push(redirectTo);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <form onFocus={() => console.log('[LoginForm] User focused the login form')}
      onSubmit={async (e) => {
        console.log('[LoginForm] User clicked login button (form submit)');
        console.log('[LoginForm] Form submit event:', e);
        await handleSubmit(e);
        // After handleSubmit, log the current location and session
        console.log('[LoginForm] After handleSubmit, window.location:', window.location.href);
        try {
          const res = await fetch('/api/auth/session');
          const session = await res.json();
          console.log('[LoginForm] /api/auth/session response:', session);
        } catch (err) {
          console.error('[LoginForm] Error fetching /api/auth/session:', err);
        }
      }} className="space-y-6">
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
          disabled={isLoading} 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            console.log('[LoginForm] User typed in email:', e.target.value);
          }}
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
          disabled={isLoading} 
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            console.log('[LoginForm] User typed in password: ***');
          }}
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
