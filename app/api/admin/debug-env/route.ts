import { NextResponse } from 'next/server';

export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const username = process.env.ADMIN_USERNAME;
  
  return NextResponse.json({
    hashExists: !!hash,
    hashLength: hash ? hash.length : 0,
    hashStartsWith: hash ? hash.substring(0, 7) : 'NONE',
    username: username || 'NOT SET (defaulting to admin)',
    hasLeadingQuote: hash ? hash.startsWith('"') : false,
    hasTrailingQuote: hash ? hash.endsWith('"') : false,
  });
}
