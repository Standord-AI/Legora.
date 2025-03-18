import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection details from your configuration
const MONGO_URI =
  "mongodb+srv://dunith20200471:cveJrDEdS7bYeFwk@fypcust0.abd2d.mongodb.net/";
const MONGO_DB_NAME = "legal_analysis";

/**
 * Cleans Markdown text by removing code block delimiters if present
 */
function cleanMarkdownReport(report: string): string {
  if (!report) return report;

  // Remove opening markdown code block if present
  let cleanedReport = report;

  // Check for opening code block with or without language specifier
  if (cleanedReport.startsWith("```markdown")) {
    cleanedReport = cleanedReport.substring("```markdown".length);
  } else if (cleanedReport.startsWith("```")) {
    cleanedReport = cleanedReport.substring("```".length);
  }

  // Remove closing code block if present
  if (cleanedReport.endsWith("```")) {
    cleanedReport = cleanedReport.substring(0, cleanedReport.length - 3);
  }

  // Trim any extra whitespace created by the removal
  cleanedReport = cleanedReport.trim();

  return cleanedReport;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // In Next.js 13+, we need to access the sessionId properly
    const { sessionId } = params;
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

      // Process the report to remove markdown code block delimiters if present
      if (sessionData.report && typeof sessionData.report === "string") {
        sessionData.report = cleanMarkdownReport(sessionData.report);
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
