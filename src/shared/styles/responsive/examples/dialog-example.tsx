"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponsiveDialog } from "../responsive-dialog"
import { useState } from "react"

export function DialogExample() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted:", { name, email })
    setOpen(false)
  }

  return (
    <ResponsiveDialog
      trigger={<Button>Open Form</Button>}
      title="User Information"
      description="Please fill out your information below"
      open={open}
      onOpenChange={setOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </ResponsiveDialog>
  )
}
