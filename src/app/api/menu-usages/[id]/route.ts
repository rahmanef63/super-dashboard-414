import { type NextRequest, NextResponse } from "next/server"
import { deleteMenuUsage, getMenuUsageById, updateMenuUsage } from "@/lib/data-services/menu-usage-service"
import { auth } from "@/app/auth/_lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const menuUsage = await getMenuUsageById(params.id)
    if (!menuUsage) {
      return NextResponse.json({ error: "Menu usage not found" }, { status: 404 })
    }

    return NextResponse.json(menuUsage)
  } catch (error) {
    console.error("Error fetching menu usage:", error)
    return NextResponse.json({ error: "Failed to fetch menu usage" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const menuUsage = await updateMenuUsage(params.id, data)
    if (!menuUsage) {
      return NextResponse.json({ error: "Menu usage not found" }, { status: 404 })
    }

    return NextResponse.json(menuUsage)
  } catch (error) {
    console.error("Error updating menu usage:", error)
    return NextResponse.json({ error: "Failed to update menu usage" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteMenuUsage(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting menu usage:", error)
    return NextResponse.json({ error: "Failed to delete menu usage" }, { status: 500 })
  }
}
