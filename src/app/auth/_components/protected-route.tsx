import type React from "react"
import { useRouter } from "next/navigation"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  async function checkUser() {
    const session = await getServerSession(authOptions)

    if (!session) {
      redirect("/auth/login")
    }
  }

  return (
    <>
      {checkUser()}
      {children}
    </>
  )
}
