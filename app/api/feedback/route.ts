import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api-staging.tcioe.edu.np";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { fullName, rollNumber, email, feedbackOrSuggestion } = body;

    // Trim whitespace and check for empty values
    const trimmedFullName = fullName?.trim();
    const trimmedRollNumber = rollNumber?.trim();
    const trimmedEmail = email?.trim();
    const trimmedFeedback = feedbackOrSuggestion?.trim();

    if (
      !trimmedFullName ||
      !trimmedRollNumber ||
      !trimmedEmail ||
      !trimmedFeedback
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details:
            "fullName, rollNumber, email, and feedbackOrSuggestion are required and cannot be empty",
        },
        { status: 400 }
      );
    }

    const requestPayload = {
      fullName: trimmedFullName,
      rollNumber: trimmedRollNumber,
      email: trimmedEmail,
      feedbackOrSuggestion: trimmedFeedback,
    };

    console.log("Submitting to external API:", requestPayload);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/website-mod/submit-feedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error("External API error:", errorData);

      // Handle different error message formats
      let errorMessage = "Failed to submit feedback";

      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(", ");
        } else {
          errorMessage = errorData.message;
        }
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.details) {
        errorMessage = errorData.details;
      }

      // Return the external API error in a consistent format
      return NextResponse.json(
        {
          error: "Failed to submit feedback",
          details: errorMessage,
          externalError: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 201,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);

    return NextResponse.json(
      {
        error: "Failed to submit feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
