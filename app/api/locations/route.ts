import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== 'false';

    const locations = await prisma.location.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}