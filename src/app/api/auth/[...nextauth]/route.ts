// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/src/app/auth/_lib/auth" // Import the centralized authOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
