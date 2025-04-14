import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({ error: "This API route is not yet implemented." }, { status: 501 });
}
