import { type NextRequest, NextResponse } from "next/server"
import { deleteMenuPermission, getMenuPermissionById, updateMenuPermission } from "@/lib/data-services/menu-permission-service"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const menuPermission = await getMenuPermissionById(params.id)
    if (!menuPermission) {
      return NextResponse.json({ error: "Menu permission not found" }, { status: 404 })
    }

    return NextResponse.json(menuPermission)
  } catch (error) {
    console.error("Error fetching menu permission:", error)
    return NextResponse.json({ error: "Failed to fetch menu permission" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const menuPermission = await updateMenuPermission(params.id, data)
    if (!menuPermission) {
      return NextResponse.json({ error: "Menu permission not found" }, { status: 404 })
    }

    return NextResponse.json(menuPermission)
  } catch (error) {
    console.error("Error updating menu permission:", error)
    return NextResponse.json({ error: "Failed to update menu permission" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteMenuPermission(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting menu permission:", error)
    return NextResponse.json({ error: "Failed to delete menu permission" }, { status: 500 })
  }
}
