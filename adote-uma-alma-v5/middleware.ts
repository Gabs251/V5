import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "gprocopio2020@gmail.com").toLowerCase();

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLoginPage = path === "/admin/login";
  const isProtected = path.startsWith("/admin") && !isLoginPage;
  const isAdminUser = !!user && (user.email ?? "").toLowerCase() === ADMIN_EMAIL;

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isProtected && user && !isAdminUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoginPage && isAdminUser) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
