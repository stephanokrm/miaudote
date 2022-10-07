import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function middleware(request: NextRequest) {
    const authenticated = request.cookies.has('authorization');
    const isLogin = request.url.includes('/login');

    if (authenticated && (isLogin || request.url.includes('/user/create'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (authenticated || isLogin) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: [
        '/user/:path*',
        '/login',
    ],
}
