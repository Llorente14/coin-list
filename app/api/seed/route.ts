// File: app/api/seed/route.ts
// API route untuk seeding database
// Hanya bisa diakses saat deploy atau dengan secret key

import { NextRequest, NextResponse } from "next/server";
import prismaWritable from "@/lib/prisma-writable";

// POST - Run seed
export async function POST(request: NextRequest) {
  try {
    // Cek apakah ini production atau ada secret key
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.SEED_SECRET_KEY || "default-secret-key-change-in-production";
    const isAuthorized = 
      process.env.NODE_ENV === "production" || 
      authHeader === `Bearer ${secretKey}` ||
      request.headers.get("x-seed-key") === secretKey;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Seeding is only allowed in production or with valid secret key." },
        { status: 403 }
      );
    }

    // Hapus semua data existing
    await prismaWritable.wishlistItem.deleteMany();

    // Seed data
    const seedData = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: "50000",
        description: "The first and most well-known cryptocurrency",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: "3000",
        description: "A decentralized platform for smart contracts",
      },
      {
        name: "Binance Coin",
        symbol: "BNB",
        price: "400",
        description: "Native token of Binance exchange",
      },
      {
        name: "Cardano",
        symbol: "ADA",
        price: "1.5",
        description: "A blockchain platform for smart contracts",
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: "100",
        description: "High-performance blockchain for decentralized apps",
      },
    ];

    const createdItems = [];
    for (const data of seedData) {
      const item = await prismaWritable.wishlistItem.create({
        data,
      });
      createdItems.push(item);
    }

    return NextResponse.json(
      { 
        message: `Successfully seeded ${createdItems.length} wishlist items`,
        items: createdItems 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET - Check seed status (read-only)
export async function GET() {
  try {
    const count = await prismaWritable.wishlistItem.count();
    return NextResponse.json(
      { 
        message: "Seed endpoint is available",
        currentItemsCount: count,
        note: "Use POST method with authorization to seed the database"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking seed status:", error);
    return NextResponse.json(
      { error: "Failed to check seed status" },
      { status: 500 }
    );
  }
}

