import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_RETRIES = 2;

function isTemporaryAiError(error) {
  return [429, 500, 502, 503, 504].includes(error?.status);
}

function pause(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function generateTravelPlan(prompt) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });
    } catch (error) {
      if (!isTemporaryAiError(error) || attempt === MAX_RETRIES) throw error;
      await pause(800 * 2 ** attempt);
    }
  }
}

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { messages = [], trip = {} } = body;

    if (!messages.length && !trip.destination) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a travel request.",
        },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((message) => {
        const role =
          message.role === "assistant" ? "Travel Unbounded AI" : "User";

        return `${role}: ${message.content}`;
      })
      .join("\n");

    const tripInformation = `
Destination: ${trip.destination || "Not specified"}
Starting location: ${trip.startLocation || "Not specified"}
Number of days: ${trip.days || "Not specified"}
Number of travelers: ${trip.travelers || "Not specified"}
Budget: ${trip.budget || "Not specified"}
Travel dates: ${trip.travelDates || "Not specified"}
Travel style: ${trip.travelStyle || "Not specified"}
Accommodation preference: ${trip.accommodation || "Not specified"}
Transportation preference: ${trip.transportation || "Not specified"}
Food preference: ${trip.food || "Not specified"}
`;

    const prompt = `
You are "Travel Unbounded AI", a professional AI travel agent.

Your job is to help users plan complete, practical and budget-conscious trips.

TRIP INFORMATION:
${tripInformation}

CONVERSATION:
${conversation}

IMPORTANT BEHAVIOR:

1. Have a natural conversation with the user.
2. Do not immediately generate a huge itinerary if important information is missing.
3. Ask for missing information.
4. Important information includes:
   - destination
   - starting location
   - number of days
   - number of travelers
   - approximate budget
5. Ask only one or two questions at a time.
6. Once enough information is available, create the complete itinerary.
7. Organize the itinerary day by day.
8. For every day provide:
   - Morning
   - Afternoon
   - Evening
   - Places to visit
   - Transportation
   - Approximate travel time
   - Approximate cost
   - Map/directions suggestion
9. Recommend suitable areas for accommodation.
10. Provide budget, mid-range and premium accommodation suggestions where appropriate.
11. Give approximate transportation costs.
12. Give approximate food costs.
13. Calculate an approximate total trip budget.
14. Include local food recommendations.
15. Include useful travel tips.
16. Avoid unnecessary backtracking in routes.
17. If the requested budget is unrealistic, explain why and suggest alternatives.
18. If the user changes destination, budget or duration, update the plan.
19. Never claim that a hotel, flight, train, bus or attraction is currently available unless availability has actually been checked.
20. Never provide fake booking confirmations.
21. Clearly label prices and travel times as estimates.
22. Give Google Maps search or directions links where useful.
23. If the destination is in India, use Indian Rupees (INR).
24. For international trips, use the appropriate local currency and also provide an approximate INR conversion when practical.
25. Consider realistic travel times between locations.

WHEN ENOUGH INFORMATION IS AVAILABLE, USE THIS FORMAT:

TRIP OVERVIEW

Destination:
Duration:
Travelers:
Starting Location:
Estimated Budget:

DAY 1

Morning:
Places:
Transport:
Estimated Time:
Estimated Cost:

Afternoon:
Places:
Transport:
Estimated Time:
Estimated Cost:

Evening:
Places:
Transport:
Estimated Time:
Estimated Cost:

Map:

DAY 2

Morning:
...

Continue for every day.

ACCOMMODATION

Recommended area:
Budget option:
Mid-range option:
Premium option:

TRANSPORTATION

FOOD TO TRY

ESTIMATED BUDGET

Accommodation:
Transportation:
Food:
Activities:
Miscellaneous:
Estimated Total:

TRAVEL TIPS

Remember:
Prices, travel times, hotel prices and attraction information are estimates and can change.
`;

    const response = await generateTravelPlan(prompt);

    const text = response.text;

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error("Travel AI error:", error);

    const temporarilyUnavailable = isTemporaryAiError(error);

    return NextResponse.json(
      {
        success: false,
        message: temporarilyUnavailable
          ? "The travel AI is busy right now. Please try again in a moment."
          : "The travel AI is temporarily unavailable. Please try again.",
      },
      { status: temporarilyUnavailable ? 503 : 500 }
    );
  }
}
