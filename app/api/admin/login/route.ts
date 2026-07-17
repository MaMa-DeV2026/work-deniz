import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { verifyAdmin, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const valid = await verifyAdmin(parsed.data.username, parsed.data.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}