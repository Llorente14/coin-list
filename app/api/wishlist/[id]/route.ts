import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get a single wishlist item by ID (Read-only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const item = await prisma.wishlistItem.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist item" },
      { status: 500 }
    );
  }
}

// PUT and DELETE operations are disabled - Database is read-only
// Use /api/seed endpoint to populate the database
