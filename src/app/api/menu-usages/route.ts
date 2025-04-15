import { type NextRequest, NextResponse } from "next/server"
import { createMenuUsage, getMenuUsages } from "@/lib/data-services/menu-usage-service"
import { auth } from "@/src/app/auth/_lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const menuId = searchParams.get("menuId")

    const menuUsages = await getMenuUsages({ menuId: menuId || undefined })
    return NextResponse.json(menuUsages)
  } catch (error) {
    console.error("Error fetching menu usages:", error)
    return NextResponse.json({ error: "Failed to fetch menu usages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const menuUsage = await createMenuUsage(data)
    return NextResponse.json(menuUsage, { status: 201 })
  } catch (error) {
    console.error("Error creating menu usage:", error)
    return NextResponse.json({ error: "Failed to create menu usage" }, { status: 500 })
  }
}
