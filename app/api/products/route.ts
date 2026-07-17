import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');
    const limit = searchParams.get('limit');

    const products = await prisma.product.findMany({
      where: collectionId ? { collectionId } : undefined,
      include: { collection: true },
      orderBy: { sortOrder: 'asc' },
      take: limit ? Number(limit) : undefined,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}