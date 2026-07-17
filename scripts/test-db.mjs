import EmbeddedPostgres from 'embedded-postgres';
import { PrismaClient } from '@prisma/client';

// Fix MINGW DLL conflict: native postgres.exe must not load msys/mingw runtimes.
const cleanPath = (process.env.PATH || '')
  .split(';')
  .filter((p) => /^[A-Za-z]:[\\/]/.test(p) && !/mingw|msys|cygwin/i.test(p));
process.env.PATH = cleanPath.join(';') + ';C:\\Windows\\system32;C:\\Windows';

process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/deniz_watch?schema=public';

const pg = new EmbeddedPostgres({
  databaseDir: 'C:/deniz_pg_data',
  user: 'postgres',
  password: 'password',
  port: 5432,
  persistent: true,
  initdbFlags: ['--locale=C', '--encoding=UTF8'],
});

async function main() {
  console.log('[test] initialise...');
  await pg.initialise();
  console.log('[test] start...');
  await pg.start();
  console.log('[test] create database deniz_watch...');
  await pg.createDatabase('deniz_watch');

  const prisma = new PrismaClient();
  await prisma.$connect();
  const res = await prisma.$queryRaw`SELECT 1 as ok`;
  console.log('[test] prisma connected:', JSON.stringify(res));
  await prisma.$disconnect();

  console.log('[test] stop...');
  await pg.stop();
  console.log('[test] SUCCESS');
}

main().catch((e) => {
  console.error('[test] FAILED', e);
  process.exit(1);
});
