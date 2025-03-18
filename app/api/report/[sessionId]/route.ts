import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection details from your configuration
const MONGO_URI =
  "mongodb+srv://dunith20200471:cveJrDEdS7bYeFwk@fypcust0.abd2d.mongodb.net/";
const MONGO_DB_NAME = "legal_analysis";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    console.log("Fetching detailed report for session ID:", sessionId);

    let client;
    try {
      // Connect to MongoDB
      client = new MongoClient(MONGO_URI);
      await client.connect();
      console.log("Connected to MongoDB");

      const db = client.db(MONGO_DB_NAME);
      const sessionsCollection = db.collection("sessions");

      // Find the session by session_id
      const sessionData = await sessionsCollection.findOne({
        session_id: sessionId,
      });

      if (!sessionData) {
        console.log("Session not found in MongoDB");
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      console.log("MongoDB session data found:", {
        session_id: sessionData.session_id,
        status: sessionData.status,
        // Log if report exists
        has_report: !!sessionData.report,
        report_length: sessionData.report ? sessionData.report.length : 0,
      });

      // Return the full session data
      return NextResponse.json(sessionData);
    } catch (dbError: any) {
      console.error("MongoDB connection error:", dbError);
      throw new Error(`Failed to connect to MongoDB: ${dbError.message}`);
    } finally {
      if (client) {
        await client.close();
        console.log("MongoDB connection closed");
      }
    }
  } catch (error: any) {
    console.error("Error in report API route:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
