import { type NextRequest, NextResponse } from "next/server"
import * as menuItemService from "@/lib/data-services/menu-item-service"
import { requireAuth } from "@/lib/middleware/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get menu item by ID
    const menuItem = await menuItemService.getMenuItemById(params.id)
    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: menuItem })
  } catch (error) {
    console.error(`Error in GET /api/menu-items/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Update menu item
    const menuItem = await menuItemService.updateMenuItem(params.id, {
      title: body.title,
      type: body.type,
      icon: body.icon,
      target: body.target,
      globalContext: body.globalContext,
      parentId: body.parentId,
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ data: menuItem })
  } catch (error) {
    console.error(`Error in PATCH /api/menu-items/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete menu item
    const success = await menuItemService.deleteMenuItem(params.id)
    if (!success) {
      return NextResponse.json({ error: "Menu item not found or could not be deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/menu-items/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
