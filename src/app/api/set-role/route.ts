import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userRole = session.user.role || 'customer';
    
    // Create response and set role cookie
    const response = NextResponse.json({ 
      success: true, 
      role: userRole,
      message: 'Role cookie set successfully' 
    });

    // Set role cookie
    response.cookies.set('user-role', userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log(`[Set Role Cookie] Setting role cookie for user: ${session.user.id}, role: ${userRole}`);

    return response;

  } catch (error) {
    console.error('[Set Role Cookie] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
