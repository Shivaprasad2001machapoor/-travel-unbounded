import { NextResponse } from "next/server";
import {
  createAdminToken,
  getAdminCookieName,
} from "../../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set({
      name: getAdminCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to login.",
      },
      {
        status: 500,
      }
    );
  }
}