'use client'

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button" // Assuming you have a Button component
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { useToast } from "@/src/shared/styles/hooks/use-toast" // Updated import path

interface AuthDialogProps {
  trigger: React.ReactNode
  initialMode?: "login" | "register"
}

export function AuthDialog({ trigger, initialMode = "login" }: AuthDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mode, setMode] = React.useState<"login" | "register">(initialMode)
  const { toast } = useToast()

  const handleSuccess = () => {
    setIsOpen(false) // Close dialog on success
    toast({
        title: mode === "login" ? "Login Successful" : "Registration Successful",
        description: mode === "login" ? "Welcome back!" : "Please check your email for verification if required.",
    })
    // Optionally trigger a state refresh or redirect if needed,
    // but often NextAuth session updates handle this automatically.
    // window.location.reload(); // Example: Force reload to reflect session changes
  }

  const handleError = (error: string) => {
     toast({
       variant: "destructive",
       title: "Error",
       description: error,
     })
  }

  const switchMode = () => {
    setMode(prevMode => (prevMode === "login" ? "register" : "login"))
  }

  // Reset mode when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setMode(initialMode), 150); // Delay reset slightly for animation
    }
  }, [isOpen, initialMode]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Sign in" : "Create account"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your credentials to access your account."
              : "Fill in the details below to create a new account."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {mode === "login" ? (
            <LoginForm onSuccess={handleSuccess} onError={handleError} isDialog={true} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onError={handleError} isDialog={true} />
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <Button variant="link" className="h-auto p-0" onClick={switchMode}>
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="link" className="h-auto p-0" onClick={switchMode}>
                Login
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
