import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const user = session.user;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Name</h2>
            <p className="text-muted-foreground">{user.name}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">User ID</h2>
            <p className="text-muted-foreground">{user.id}</p>
          </div>

          <div>
            {/* Assuming last sign-in time is not directly available from NextAuth session */}
            {/* If you have a way to track this (e.g., in your database), you can uncomment and adapt the following: */}
            {/* <h2 className="text-lg font-semibold">Last Sign In</h2> */}
            {/* <p className="text-muted-foreground">{new Date(user.last_sign_in_at || "").toLocaleString()}</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
