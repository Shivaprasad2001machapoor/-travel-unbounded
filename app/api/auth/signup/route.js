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

    const {
      name,
      email,
      password,
    } = body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (cleanName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (!cleanEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
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

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const {
      hash,
      salt,
    } = hashPassword(password);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash: hash,
      passwordSalt: salt,
    });

    const token = createUserToken(
      user._id.toString(),
      user.email
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );

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
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create account.",
      },
      {
        status: 500,
      }
    );
  }
}
