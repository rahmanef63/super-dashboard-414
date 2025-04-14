import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Check your email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent you a verification link. Please check your email to verify your account.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Return to login
          </Link>
        </p>
      </div>
    </div>
  )
}
