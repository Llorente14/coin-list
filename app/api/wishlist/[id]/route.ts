import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get a single wishlist item by ID
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

// PUT - Update a wishlist item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const body = await request.json();
    const { name, symbol, price, description } = body;

    if (!name || !symbol || !price) {
      return NextResponse.json(
        { error: "Name, symbol, and price are required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlistItem.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        symbol: symbol.toUpperCase(),
        price,
        description: description || "Tidak ada deskripsi",
      },
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }
    console.error("Error updating wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a wishlist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    await prisma.wishlistItem.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json(
      { message: "Wishlist item deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist item" },
      { status: 500 }
    );
  }
}
