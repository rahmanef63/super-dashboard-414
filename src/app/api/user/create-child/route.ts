import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "This functionality is not yet implemented." },
    { status: 501 },
  )
}
