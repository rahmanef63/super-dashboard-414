import { NextResponse } from "next/server"
import { getUserUiSettings, updateUserUiSettings } from "@/lib/data-services/user-service"

// GET /api/users/[id]/settings
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const settings = await getUserUiSettings(id)

    if (!settings) {
      return NextResponse.json({ message: "UI Settings not found" }, { status: 404 })
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error("Error fetching UI settings:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// PATCH /api/users/[id]/settings
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { fontSize, colorTheme, layoutMode, additionalSettings } = await request.json()

  try {
    const updatedSettings = await updateUserUiSettings(id, { fontSize, colorTheme, layoutMode, additionalSettings })

    if (!updatedSettings) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "UI settings updated", settings: updatedSettings })
  } catch (error: any) {
    console.error("Error updating UI settings:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
