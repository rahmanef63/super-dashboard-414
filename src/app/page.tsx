export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Super Dashboard</h2>
        <p className="mb-6">Please sign in to continue</p>
        <a
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Go to Login
        </a>
      </div>
    </div>
  )
}
