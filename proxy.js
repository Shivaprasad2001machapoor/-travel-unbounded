import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "travel_unbounded_admin";
const USER_COOKIE_NAME = "travel_unbounded_user";

async function verifyAdminToken(token) {
  try {
    const secret = process.env.ADMIN_SECRET;

    if (!secret || !token) {
      return false;
    }

    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    const { username, timestamp, signature } = decoded;

    if (!username || !timestamp || !signature) {
      return false;
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return false;
    }

    const age = Date.now() - Number(timestamp);
    const maxAge = 1000 * 60 * 60 * 8;

    if (age < 0 || age > maxAge) {
      return false;
    }

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

    const data = encoder.encode(`${username}.${timestamp}`);

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      data
    );

    const expectedSignature = Array.from(
      new Uint8Array(signatureBuffer)
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

async function verifyUserToken(token) {
  try {
    const secret = process.env.ADMIN_SECRET;

    if (!secret || !token) {
      return false;
    }

    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    const {
      userId,
      email,
      timestamp,
      signature,
    } = decoded;

    if (!userId || !email || !timestamp || !signature) {
      return false;
    }

    const age = Date.now() - Number(timestamp);

    const maxAge = 1000 * 60 * 60 * 24 * 7;

    if (age < 0 || age > maxAge) {
      return false;
    }

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

    const data = encoder.encode(
      `${userId}.${email}.${timestamp}`
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      data
    );

    const expectedSignature = Array.from(
      new Uint8Array(signatureBuffer)
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  /*
   * ADMIN AREA
   *
   * Only the admin cookie can access enquiries.
   */
  if (pathname.startsWith("/admin/enquiries")) {
    const token = request.cookies.get(
      ADMIN_COOKIE_NAME
    )?.value;

    const authenticated = await verifyAdminToken(token);

    if (!authenticated) {
      const loginUrl = new URL(
        "/admin/login",
        request.url
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  /*
   * PUBLIC AUTH PAGES
   *
   * Login and signup must remain accessible
   * without being logged in.
   */
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  /*
   * ADMIN LOGIN
   *
   * Admin login must remain accessible without
   * a normal user account.
   */
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/")
  ) {
    return NextResponse.next();
  }

  /*
   * PROTECTED TRAVEL UNBOUNDED WEBSITE
   *
   * User must be signed in to enter the main website.
   */
  const protectedPages = [
    "/",
    "/about",
    "/contact",
  ];

  const isProtectedPage = protectedPages.some(
    (page) =>
      pathname === page ||
      pathname.startsWith(`${page}/`)
  );

  if (isProtectedPage) {
    const token = request.cookies.get(
      USER_COOKIE_NAME
    )?.value;

    const authenticated = await verifyUserToken(token);

    if (!authenticated) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/contact/:path*",
    "/login",
    "/signup",
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/admin/:path*",
  ],
};
