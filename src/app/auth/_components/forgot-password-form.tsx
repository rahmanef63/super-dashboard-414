"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ForgotPasswordForm() {
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        toast({
            title: "Not Implemented",
            description: "Password reset functionality is not yet implemented.",
            variant: "destructive",
        });
    };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">

          <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  disabled // Disable the input since functionality is not implemented
              />
          </div>

          <Button type="submit" className="w-full">
              Send reset instructions
          </Button>
      </form>
  );
}
