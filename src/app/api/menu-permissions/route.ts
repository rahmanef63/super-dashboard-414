import { type NextRequest, NextResponse } from "next/server"
import { createMenuPermission, getMenuPermissions } from "@/lib/data-services/menu-permission-service"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const menuId = searchParams.get("menuId")
    const roleId = searchParams.get("roleId")

    const menuPermissions = await getMenuPermissions({
      menuId: menuId || undefined,
      roleId: roleId || undefined,
    })
    return NextResponse.json(menuPermissions)
  } catch (error) {
    console.error("Error fetching menu permissions:", error)
    return NextResponse.json({ error: "Failed to fetch menu permissions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const menuPermission = await createMenuPermission(data)
    return NextResponse.json(menuPermission, { status: 201 })
  } catch (error) {
    console.error("Error creating menu permission:", error)
    return NextResponse.json({ error: "Failed to create menu permission" }, { status: 500 })
  }
}
