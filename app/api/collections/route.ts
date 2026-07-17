import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Collections API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}