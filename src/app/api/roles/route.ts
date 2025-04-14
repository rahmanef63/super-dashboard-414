import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const roles = await prisma.role.findMany();

        return NextResponse.json({
            success: true,
            roles: roles.map((role) => role.name),
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";
