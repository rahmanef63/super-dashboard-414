import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Not Implemented" }, { status: 501 })
}
