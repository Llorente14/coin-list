// File: lib/prisma-writable.ts
// Prisma client untuk operasi write (hanya untuk seeding)

import { PrismaClient } from "@prisma/client";
import path from 'path';

// Deklarasikan 'prisma' pada objek global NodeJS
declare global {
  // eslint-disable-next-line no-var
  var cachedPrismaWritable: PrismaClient;
}

// Workaround to find the db file in production
const filePath = path.join(process.cwd(), 'prisma/local.db');

const config = {
  datasources: {
    db: {
      url: 'file:' + filePath,
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

