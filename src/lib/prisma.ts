import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For SQLite in Prisma 7, we need to pass the URL to the client
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Create the adapter for SQLite
const libsql = createClient({
  url: databaseUrl,
});

const adapter = new PrismaLibSql({ url: databaseUrl });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
