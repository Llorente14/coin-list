// File: prisma/seed.ts
// Seed file untuk mengisi database dengan data awal

import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs';

// Workaround to find the db file in production
// Gunakan DATABASE_URL jika ada, jika tidak gunakan path default
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    // Jika DATABASE_URL sudah ada, gunakan langsung
    return process.env.DATABASE_URL;
  }
  
  // Coba beberapa path yang mungkin
  const possiblePaths = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'Coin-Wishlist', 'prisma', 'dev.db'),
    path.resolve(__dirname, 'dev.db'),
  ];
  
  // Cari path yang ada
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return 'file:' + filePath;
    }
  }
  
  // Jika tidak ditemukan, gunakan path default (akan dibuat oleh Prisma jika belum ada)
  const defaultPath = path.join(process.cwd(), 'prisma', 'dev.db');
  return 'file:' + defaultPath;
};

const databaseUrl = getDatabaseUrl();

const config = {
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
};

const prisma = new PrismaClient(config);

async function main() {
  console.log("🌱 Starting seed...");

  // Hapus semua data existing (optional)
  await prisma.wishlistItem.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Seed data contoh
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

  // Insert data
  for (const data of seedData) {
    await prisma.wishlistItem.create({
      data,
    });
  }

  console.log(`✅ Seeded ${seedData.length} wishlist items`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

