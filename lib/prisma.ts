import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ── Singleton probe ──────────────────────────────────────────────
// Each time this module is freshly loaded (not reused from globalThis)
// a different ID is generated. If you see MULTIPLE distinct IDs in
// the dev server logs during the same session (without editing files),
// the singleton is being recreated — likely a Next.js App Router HMR
// module isolation issue.
const INSTANCE_ID = Math.random().toString(36).slice(2, 8);

// Capture reuse BEFORE assignment so the log is accurate
const isReused = !!globalForPrisma.prisma;

const client =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = client;
  console.log(`[prisma] instance=${INSTANCE_ID} reused=${isReused}`);
}

export const prisma = client;
export { INSTANCE_ID };
export default prisma;