import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [products, posts, unread, applications, contacts, careers] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.contact.count({ where: { read: false } }),
    prisma.careerApplication.count(),
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.careerApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return NextResponse.json({
    stats: {
      products,
      posts,
      unread,
      applications,
    },
    contacts,
    careers,
  });
}
