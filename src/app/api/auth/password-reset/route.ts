import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Password reset needs to be re-implemented for NextAuth.js
  return NextResponse.json(
    {
      error: "Password reset functionality is not yet implemented.",
    },
    { status: 501 }
  )
}
