import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/userAuth";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../lib/User";

export async function GET() {
  try {
    const authenticatedUser = await getAuthenticatedUser();

    if (!authenticatedUser) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    await connectDB();

    const user = await User.findById(
      authenticatedUser.userId
    ).select("name email");

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("User authentication check error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      {
        status: 500,
      }
    );
  }
}