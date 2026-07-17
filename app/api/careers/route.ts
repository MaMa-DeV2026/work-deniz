import { NextResponse } from 'next/server';
import { careerSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';
import { sendCareerEmail, sendCareerConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = careerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const application = await prisma.careerApplication.create({ data: parsed.data });

    await sendCareerEmail(parsed.data);
    await sendCareerConfirmation(parsed.data);

    return NextResponse.json({ success: true, id: application.id }, { status: 200 });
  } catch (error) {
    console.error('Careers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}