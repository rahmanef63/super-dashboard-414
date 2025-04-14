import { LoginForm } from "../_components/login-form"
import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // Updated import path
import Link from "next/link"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    // Redirect to a dashboard or home page after login
    // Adjust the redirect path as needed (e.g., '/dashboard')
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
