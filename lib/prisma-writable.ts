// File: lib/prisma-writable.ts
// Prisma client untuk operasi write (hanya untuk seeding)

import { PrismaClient } from "@prisma/client";

// Deklarasikan 'prisma' pada objek global NodeJS
declare global {
  var prismaWritable: PrismaClient | undefined;
}

// Cek jika 'prisma' sudah ada di global, jika tidak, buat baru.
// Ini mencegah pembuatan instance PrismaClient baru setiap kali
// ada hot-reload di Next.js (mode development).
const client = globalThis.prismaWritable || new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaWritable = client;
}

export default client;

