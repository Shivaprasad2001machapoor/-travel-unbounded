import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Enquiry from "../../../lib/Enquiry";
import { isAdminAuthenticated } from "../../../lib/auth";

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch enquiries.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      destination,
      travelDates,
      travellers,
      message,
    } = body;

    const errors = {};

    if (!name || !name.trim()) {
      errors.name = "Name is required.";
    }

    if (!email || !email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!phone || !phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (!destination || !destination.trim()) {
      errors.destination = "Destination is required.";
    }

    if (!travelDates || !travelDates.trim()) {
      errors.travelDates = "Travel dates are required.";
    }

    if (!travellers || Number(travellers) < 1) {
      errors.travellers = "At least 1 traveller is required.";
    }

    if (!message || !message.trim()) {
      errors.message = "Message is required.";
    } else if (message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors,
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      destination: destination.trim(),
      travelDates: travelDates.trim(),
      travellers: Number(travellers),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        enquiryId: enquiry._id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit enquiry.",
      },
      {
        status: 500,
      }
    );
  }
}