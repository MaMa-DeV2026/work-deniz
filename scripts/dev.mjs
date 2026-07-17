import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import EmbeddedPostgres from 'embedded-postgres';
import { PrismaClient } from '@prisma/client';

// ── 1. Sanitize PATH so native postgres.exe never loads msys/mingw runtimes ──
const nodeDir = path.dirname(process.execPath);
const cleanPath = (process.env.PATH || '')
  .split(';')
  .filter((p) => /^[A-Za-z]:[\\/]/.test(p) && !/mingw|msys|cygwin/i.test(p));
if (!cleanPath.some((p) => p.toLowerCase() === nodeDir.toLowerCase())) {
  cleanPath.push(nodeDir);
}
process.env.PATH = cleanPath.join(';') + ';C:\\Windows\\system32;C:\\Windows';

const DATABASE_URL =
  'postgresql://postgres:password@localhost:5432/deniz_watch?schema=public';
process.env.DATABASE_URL = DATABASE_URL;

const DATA_DIR = 'C:/deniz_pg_data';
const DB_USER = 'postgres';
const DB_PASS = 'password';
const DB_NAME = 'deniz_watch';

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    child.on('exit', (code) =>
      code === 0 ? resolve(code) : reject(new Error(`${cmd} exited ${code}`))
    );
    child.on('error', reject);
  });
}

async function killStalePostgres() {
  try {
    await run('taskkill', ['/F', '/IM', 'postgres.exe', '/T']);
  } catch {
    /* none running */
  }
}

async function main() {
  await killStalePostgres();

  // ── 2. Start embedded PostgreSQL ──
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: DB_USER,
    password: DB_PASS,
    port: 5432,
    persistent: true,
    initdbFlags: ['--locale=C', '--encoding=UTF8'],
  });

  if (!fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'))) {
    console.log('[dev] initialising PostgreSQL cluster...');
    await pg.initialise();
  } else {
    console.log('[dev] PostgreSQL cluster already initialised.');
  }

  console.log('[dev] starting PostgreSQL...');
  await pg.start();
  try {
    await pg.createDatabase(DB_NAME);
    console.log(`[dev] created database "${DB_NAME}".`);
  } catch {
    console.log(`[dev] database "${DB_NAME}" already exists.`);
  }

  // ── 3. Sync Prisma schema to the database ──
  console.log('[dev] prisma db push...');
  await run('npx', ['prisma', 'db', 'push', '--skip-generate', '--accept-data-loss']);

  // ── 4. Seed only if empty ──
  const prisma = new PrismaClient();
  const count = await prisma.collection.count();
  if (count === 0) {
    console.log('[dev] database empty — seeding...');
    await run('npx', [
      'ts-node',
      '--transpile-only',
      '--project',
      'prisma/tsconfig.seed.json',
      'prisma/seed.ts',
    ]);
  } else {
    console.log(`[dev] database already seeded (${count} collections).`);
  }
  await prisma.$disconnect();

  // ── 5. Start Next.js dev server ──
  console.log('[dev] starting next dev...');
  const next = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true, env: process.env });

  const shutdown = async (sig) => {
    console.log(`\n[dev] received ${sig} — shutting down...`);
    next.kill('SIGTERM');
    try {
      await pg.stop();
    } catch {}
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((e) => {
  console.error('[dev] FAILED:', e);
  process.exit(1);
});
