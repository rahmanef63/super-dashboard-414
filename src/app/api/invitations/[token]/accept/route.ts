import { type NextRequest, NextResponse } from "next/server"
import { acceptInvitation } from "@/lib/data-services/invitation-service"

/**
 * POST /api/invitations/[token]/accept
 * Accept an invitation
 */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params
    const { userId } = await request.json()

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Accept the invitation
    const result = await acceptInvitation(token, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      membershipId: result.membershipId,
    })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
  }
}
