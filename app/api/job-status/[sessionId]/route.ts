import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Use the params object properly
    const { sessionId } = params;

    console.log("API route handling request for session ID:", sessionId);

    // Forward the request to the backend
    const response = await fetch(
      `http://localhost:8000/job-status/${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Get the response data
    const data = await response.json();
    console.log("Backend job-status response:", data);

    // Return the response
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
