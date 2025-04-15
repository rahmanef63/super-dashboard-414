import { LoginForm } from "../_components/login-form";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/app/auth/_lib/auth'; // Updated import path
import Link from "next/link";

export default async function LoginPage() {
  // const session = await getServerSession(authOptions)

  // if (session) {
    // Redirect to a dashboard or home page after login
    // Adjust the redirect path as needed (e.g., '/dashboard')
  //  redirect("/")
  // }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>
        <LoginForm />
         <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
                Register
            </Link>
         </p>
         <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link href="/auth/forgot-password" passHref className="text-xs text-muted-foreground hover:underline">
                Forgot Password?
            </Link>
         </p>
         <p className="mt-6 text-center text-xs text-muted-foreground">
           <Link href="/" passHref className="hover:underline">
             Back to Home
           </Link>
         </p>
      </div>
    </div>
  );
}
