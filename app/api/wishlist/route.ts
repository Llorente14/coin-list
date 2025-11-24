import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all wishlist items (Read-only)
export async function GET() {
  try {
    const items = await prisma.wishlistItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: `Failed to fetch wishlist items: ${error}` },
      { status: 500 }
    );
  }
}

// POST, PUT, DELETE operations are disabled - Database is read-only
// Use /api/seed endpoint to populate the database
