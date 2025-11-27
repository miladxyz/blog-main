import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (verifyPassword(password)) {
      return NextResponse.json({ 
        success: true,
        token: 'simple-auth-token'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid password' }, 
      { status: 401 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: 'Login failed' }, 
      { status: 500 }
    );
  }
}