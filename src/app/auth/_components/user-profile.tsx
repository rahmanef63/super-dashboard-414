"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="p-4">Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className="p-4">You are not logged in.</div>
  }

  if (status === "authenticated" && session.user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={session.user.email || ""} disabled className="mt-1" />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={session.user.name || ""} disabled className="mt-1" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    )
  }
}
