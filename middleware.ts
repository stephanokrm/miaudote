import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function middleware(request: NextRequest) {
    const authenticated = request.cookies.has('authorization');
    const isLogin = request.url.includes('/login');
    const isCreate = request.url.includes('/user/create');

    if (authenticated && (isLogin || isCreate)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!authenticated && (isLogin || isCreate)) {
        return NextResponse.next();
    }

    if (!authenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/user/:path*',
        '/login',
    ],
}
