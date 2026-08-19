import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("token", token)
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/cart", "/profile"];
  const authRoutes = ["/login", "/signup"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 🔒 Protected Routes (Cart, Profile)
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Admin Routes
  if (isAdminRoute) {
    console.log("Admin route accessed:", pathname);
    console.log("Token in cookie:", token);

    if (!token) {
      console.log("Token not found, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = jwt.verify(token, "mysecretkey") as JwtPayload & { role: string };
      console.log("Decoded token:", decoded);

      if (decoded.role !== "admin") {
        console.log("Role is not admin, redirecting to /");
        return NextResponse.redirect(new URL("/", req.url));
      }

      console.log("Admin verified, allow access to dashboard");

    } catch (err) {
      console.log("JWT verification failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }


  //   // 🚫 Login/Signup page access when already logged in
  //   if (isAuthRoute && token) {
  //     try {
  //       const decoded = jwt.verify(token, "mysecretkey") as JwtPayload & { role: string };

  //       if (decoded.role === "admin") {
  //         return NextResponse.redirect(new URL("/admin", req.url));
  //       } else {
  //         return NextResponse.redirect(new URL("/", req.url));
  //       }
  //     } catch (err) {
  //       return NextResponse.redirect(new URL("/login", req.url));
  //     }
  //   }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/cart/:path*",
    "/login",
    "/signup",
    "/profile/:path*",
    "/admin/:path*",
    "/products/:path*"
  ],
};
