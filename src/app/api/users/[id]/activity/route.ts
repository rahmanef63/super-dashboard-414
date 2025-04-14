import { NextResponse } from "next/server"
import { getUserActivityLogs } from "@/lib/data-services/user-service"

// GET /api/users/[id]/activity
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get("limit")) || 50
  const offset = Number(searchParams.get("offset")) || 0

  try {
    const logs = await getUserActivityLogs(id, limit, offset)
    return NextResponse.json({ logs })
  } catch (error: any) {
    console.error("Error fetching user activity:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
