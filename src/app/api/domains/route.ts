import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Corrected import

// GET /api/domains
export async function GET(req: Request) {
  // TODO: Protect route with authentication, only allow admins to fetch all domains
  console.log("GET /api/domains - Received request");
  try {
    // Example: Fetch all domains (ensure proper auth/authz)
    const domains = await prisma.externalDomain.findMany();
    console.log(`GET /api/domains - Found ${domains.length} domains`);
    return NextResponse.json(domains, { status: 200 });
  } catch (error) {
    console.error("GET /api/domains - Error:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
  // return NextResponse.json({ error: "This API route is not yet implemented." }, { status: 501 })
}

// POST /api/domains
export async function POST(req: Request) {
  console.log("POST /api/domains - Received request");
  try {
    const body = await req.json();
    console.log("POST /api/domains - Request Body:", body);
    const { domainName, description, organizationId } = body;

    // Basic validation
    if (!domainName || !organizationId) {
      console.warn("POST /api/domains - Validation Failed: Missing domainName or organizationId");
      return NextResponse.json({ error: "Missing required fields: domainName, organizationId" }, { status: 400 });
    }

    // Check if the domain already exists
    console.log(`POST /api/domains - Checking for existing domain: ${domainName}`);
    const existingDomain = await prisma.externalDomain.findUnique({ where: { domainName } });
    if (existingDomain) {
      console.warn(`POST /api/domains - Domain already exists: ${domainName}`);
      return NextResponse.json({ error: "Domain already exists" }, { status: 409 }); // Use 409 Conflict
    }

    // Create the new domain
    console.log(`POST /api/domains - Creating domain: ${domainName}`);
    const domain = await prisma.externalDomain.create({
      data: {
        domainName,
        // Can be null or undefined if optional
        description, // Can be null or undefined if optional
        organizationId,
      },
    });

    console.log("POST /api/domains - Domain created successfully:", domain);
    return NextResponse.json({ message: "Domain created successfully", domain }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/domains - Error creating domain:", error);
    // More specific error handling (e.g., Prisma errors)
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
