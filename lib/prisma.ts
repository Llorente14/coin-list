import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
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
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient(config);
  }
  prisma = global.cachedPrisma;
}

// Wrapper read-only yang memblokir semua operasi write
const readOnlyPrisma = new Proxy(prisma, {
  get(target, prop) {
    // Izinkan semua operasi read dan utility methods
    if (typeof prop === "string" && (
      prop.startsWith("find") ||
      prop.startsWith("count") ||
      prop.startsWith("aggregate") ||
      prop.startsWith("groupBy") ||
      prop === "$transaction" ||
      prop === "$connect" ||
      prop === "$disconnect" ||
      prop === "$on" ||
      prop === "$use" ||
      prop === "$extends" ||
      prop === "wishlistItem" // Izinkan akses ke model
    )) {
      // Untuk model, return proxy yang memblokir write operations
      if (prop === "wishlistItem") {
        const model = target[prop as keyof typeof target];
        return new Proxy(model as any, {
          get(modelTarget, modelProp) {
            // Blokir operasi write
            if (typeof modelProp === "string" && (
              modelProp === "create" ||
              modelProp === "createMany" ||
              modelProp === "update" ||
              modelProp === "updateMany" ||
              modelProp === "upsert" ||
              modelProp === "delete" ||
              modelProp === "deleteMany"
            )) {
              return () => {
                throw new Error("Database is read-only. Write operations are not allowed.");
              };
            }
            return modelTarget[modelProp as keyof typeof modelTarget];
          }
        });
      }
      return target[prop as keyof typeof target];
    }
    
    // Blokir operasi write lainnya
    if (typeof prop === "string" && (
      prop.startsWith("create") ||
      prop.startsWith("update") ||
      prop.startsWith("delete") ||
      prop.startsWith("upsert")
    )) {
      return () => {
        throw new Error("Database is read-only. Write operations are not allowed.");
      };
    }
    
    return target[prop as keyof typeof target];
  }
});

export const db = readOnlyPrisma;
export default readOnlyPrisma;
