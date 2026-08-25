import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../lib/User";
import {
  createUserToken,
  getUserCookieName,
  hashPassword,
} from "../../../../lib/userAuth";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const { hash } = hashPassword(
      password,
      user.passwordSalt
    );

    if (hash !== user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token = createUserToken(
      user._id.toString(),
      user.email
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set({
      name: getUserCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

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