import { type NextRequest, NextResponse } from "next/server"
import { authMiddleware } from "@/lib/middleware/auth-middleware"
import * as menuEntryService from "@/lib/data-services/menu-entry-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    // Get menu entry by ID
    const menuEntries = await menuEntryService.getMenuEntriesForMenuItem(params.id);
    // If multiple entries are possible, adjust logic as needed
    // For now, just get the first entry (or null)
    const menuEntryById = menuEntries && menuEntries.length > 0 ? menuEntries[0] : null;
    if (!menuEntryById) {
      return NextResponse.json({ error: "Menu entry not found" }, { status: 404 });
    }
    return NextResponse.json({ data: menuEntryById });
  } catch (error) {
    console.error(`Error in GET /api/menu-entries/${params.id}:`, error);
    return NextResponse.json({ error: "Failed to fetch menu entry" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    // Get request body
    const body = await request.json();
    // Update menu entry
    const menuEntry = await menuEntryService.updateMenuEntry(params.id, {
      data: body.data,
    });
    if (!menuEntry) {
      return NextResponse.json({ error: "Menu entry not found" }, { status: 404 });
    }
    return NextResponse.json({ data: menuEntry });
  } catch (error) {
    console.error(`Error in PATCH /api/menu-entries/${params.id}:`, error);
    return NextResponse.json({ error: "Failed to update menu entry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    // Delete menu entry
    const success = await menuEntryService.deleteMenuEntry(params.id);
    if (!success) {
      return NextResponse.json({ error: "Menu entry not found or could not be deleted" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/menu-entries/${params.id}:`, error);
    return NextResponse.json({ error: "Failed to delete menu entry" }, { status: 500 });
  }
}
