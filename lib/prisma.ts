import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const INSTANCE_ID = Math.random().toString(36).slice(2, 8);
const isReused = !!globalForPrisma.prisma;

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

const client = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = client;
  console.log(`[prisma] instance=${INSTANCE_ID} reused=${isReused}`);
}

export const prisma = client;
export { INSTANCE_ID };
export default prisma;