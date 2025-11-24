// File: lib/prisma-readonly.ts
// Read-only Prisma client wrapper yang memblokir semua operasi write

import { PrismaClient } from "@prisma/client";

// Deklarasikan 'prisma' pada objek global NodeJS
declare global {
  var prismaReadOnly: PrismaClient | undefined;
}

// Buat Prisma client biasa
const baseClient = globalThis.prismaReadOnly || new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaReadOnly = baseClient;
}

// Wrapper read-only yang memblokir operasi write
const readOnlyClient = new Proxy(baseClient, {
  get(target, prop) {
    // Izinkan semua operasi read
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

export default readOnlyClient;

