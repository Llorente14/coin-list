import { PrismaClient } from '@prisma/client';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
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
