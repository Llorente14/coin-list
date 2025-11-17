import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all wishlist items
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
      { error: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}

// POST - Create a new wishlist item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, symbol, price, description } = body;

    if (!name || !symbol || !price) {
      return NextResponse.json(
        { error: "Name, symbol, and price are required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlistItem.create({
      data: {
        name,
        symbol: symbol.toUpperCase(),
        price,
        description: description || "Tidak ada deskripsi",
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to create wishlist item" },
      { status: 500 }
    );
  }
}
