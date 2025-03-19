import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

const guestOnlyRoutes = ['/auth/signin', '/auth/signup'];
const userOnlyRoutes = ['/profile', '/worksapce', '/auth/link-account'];
const adminOnlyRoutes = ['/admin',];

export const config = { matcher: ["/admin", '/profile', '/worksapce/:path*', '/auth/link-account'] }

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const user = token?.user as { role: string };

    const url = req.nextUrl;
    const isAuth = !!token; // Проверка авторизации
    const isAdmin = user.role === 'admin'; // Проверка роли (если доступна в токене)

    // Гость не может заходить на защищенные маршруты
    if (!isAuth && userOnlyRoutes.some((route) => url.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/signin', url));
    }

    // Авторизованный пользователь не должен попадать на страницы для гостей
    if (isAuth && guestOnlyRoutes.includes(url.pathname)) {
      return NextResponse.redirect(new URL('/profile', url));
    }

    // Проверка доступа к админ-маршрутам
    if (!isAdmin && adminOnlyRoutes.some((route) => url.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/profile', url));
    }

    return NextResponse.next();
  }
);