import { NextResponse } from "next/server"
import { updateDomain, deleteDomain } from "@/lib/data-services/external-domain-service"

// GET /api/domains/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // TODO: Protect route with authentication, only allow admins to fetch a specific domain
  return NextResponse.json({ error: "This API route is not yet implemented." }, { status: 501 })
}

// PATCH /api/domains/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { domainName, description } = await req.json()

  try {
    const updatedDomain = await updateDomain(id, { domainName, description })

    if (!updatedDomain) {
      return NextResponse.json({ message: "Domain not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Domain updated", domain: updatedDomain })
  } catch (error: any) {
    console.error("Error updating domain:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// DELETE /api/domains/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    await deleteDomain(id)
    return NextResponse.json({ message: "Domain deleted" })
  } catch (error: any) {
    console.error("Error deleting domain:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
