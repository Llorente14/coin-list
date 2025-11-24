// File: lib/prisma-writable.ts
// Prisma client untuk operasi write (hanya untuk seeding)

import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs';

// Deklarasikan 'prisma' pada objek global NodeJS
declare global {
  // eslint-disable-next-line no-var
  var cachedPrismaWritable: PrismaClient;
}

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
    path.resolve(__dirname, '..', 'prisma', 'dev.db'),
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

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(config);
} else {
  if (!global.cachedPrismaWritable) {
    global.cachedPrismaWritable = new PrismaClient(config);
  }
  prisma = global.cachedPrismaWritable;
}

export default prisma;

