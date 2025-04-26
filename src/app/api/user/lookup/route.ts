import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }    

    // Look up the user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }, // Select only the necessary fields
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error looking up user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
