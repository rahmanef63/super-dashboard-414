import { ResetPasswordForm } from "../_components/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Set new password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
