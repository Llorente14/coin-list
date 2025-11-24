// File: app/api/seed/route.ts
// API route untuk seeding database
// Hanya bisa diakses saat deploy atau dengan secret key

import { NextRequest, NextResponse } from "next/server";
import prismaWritable from "@/lib/prisma-writable";

// POST - Run seed
export async function POST(request: NextRequest) {
  try {
    // Cek apakah ini production atau ada secret key
    // Di development, izinkan tanpa auth. Di production, butuh secret key
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.SEED_SECRET_KEY || "default-secret-key-change-in-production";
    const isDevelopment = process.env.NODE_ENV !== "production";
    const hasValidAuth = 
      authHeader === `Bearer ${secretKey}` ||
      request.headers.get("x-seed-key") === secretKey;
    
    const isAuthorized = isDevelopment || hasValidAuth;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. In production, seeding requires a valid secret key via Authorization header or x-seed-key header." },
        { status: 403 }
      );
    }

    // Cek query parameter untuk menentukan apakah harus clear data atau tambah saja
    const { searchParams } = new URL(request.url);
    const clearData = searchParams.get('clear') === 'true';

    if (clearData) {
      // Hapus semua data existing jika parameter clear=true
      await prismaWritable.wishlistItem.deleteMany();
    }

    // Seed data - tambahkan 5 data baru
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
      {
        name: "Polkadot",
        symbol: "DOT",
        price: "7.5",
        description: "Interoperable blockchain network connecting multiple chains",
      },
      {
        name: "Chainlink",
        symbol: "LINK",
        price: "15",
        description: "Decentralized oracle network for smart contracts",
      },
      {
        name: "Polygon",
        symbol: "MATIC",
        price: "0.8",
        description: "Ethereum scaling solution with faster transactions",
      },
    ];

    const createdItems = [];
    for (const data of seedData) {
      // Cek apakah data sudah ada berdasarkan symbol (untuk menghindari duplikasi)
      const existing = await prismaWritable.wishlistItem.findFirst({
        where: { symbol: data.symbol },
      });
      
      if (!existing) {
        const item = await prismaWritable.wishlistItem.create({
          data,
        });
        createdItems.push(item);
      } else {
        // Skip jika sudah ada
        createdItems.push({ ...existing, skipped: true });
      }
    }

    const newItems = createdItems.filter(item => !item.skipped);
    const skippedItems = createdItems.filter(item => item.skipped);
    
    return NextResponse.json(
      { 
        message: `Successfully processed ${createdItems.length} items: ${newItems.length} new, ${skippedItems.length} skipped (already exist)`,
        newItems: newItems.length,
        skippedItems: skippedItems.length,
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

