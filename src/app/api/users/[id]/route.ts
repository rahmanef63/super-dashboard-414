import { NextResponse } from "next/server"
import { getRoleById } from "@/lib/data-services/role-service"
import { getUserById, updateUser, deleteUser } from "@/lib/data-services/user-service"

// GET /api/users/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// PATCH /api/users/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { name, email, passwordHash, roleId } = await request.json()

  try {
    // Validate role ID if provided
    if (roleId) {
      const role = await getRoleById(roleId)
      if (!role) {
        return NextResponse.json({ message: "Role not found" }, { status: 400 })
      }
    }

    // Build update data object
    const updateData: any = { name, email, passwordHash };
    if (roleId) {
      updateData.role = { connect: { id: roleId } };
    }
    const updatedUser = await updateUser(id, updateData)

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated", user: updatedUser })
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// DELETE /api/users/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    await deleteUser(id)
    return NextResponse.json({ message: "User deleted" })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
