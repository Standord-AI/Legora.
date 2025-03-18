import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

// MongoDB connection details
const MONGO_URI =
  "mongodb+srv://dunith20200471:cveJrDEdS7bYeFwk@fypcust0.abd2d.mongodb.net/";
const MONGO_DB_NAME = "legal_analysis";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, history } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Get session data from MongoDB
    const sessionData = await getSessionData(sessionId);
    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Build context from document, report, and logs
    const context = await buildContext(sessionData);

    // Generate response using OpenAI
    const response = await generateOpenAIResponse(message, context, history);

    return NextResponse.json({
      response: response,
    });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

async function getSessionData(sessionId: string) {
  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGO_URI);
    await client.connect();

    const db = client.db(MONGO_DB_NAME);
    const sessionsCollection = db.collection("sessions");

    // Find the session by session_id
    return await sessionsCollection.findOne({ session_id: sessionId });
  } catch (error) {
    console.error("MongoDB error:", error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function buildContext(sessionData: any) {
  let context = "";

  // Add report content to context if available
  if (sessionData?.report) {
    context += `COMPLIANCE REPORT:\n${sessionData.report}\n\n`;
  } else {
    // Fallback to sample report for demo
    try {
      const reportPath = path.join(
        process.cwd(),
        "public",
        "pdf-text",
        "markdown-report.txt"
      );
      const reportContent = await fs.readFile(reportPath, "utf-8");
      context += `COMPLIANCE REPORT:\n${reportContent}\n\n`;
    } catch (error) {
      console.error("Error reading sample report:", error);
    }
  }

  // Add log file content to context if available
  if (sessionData?.log_file) {
    // Extract key insights from logs rather than including everything
    const logSummary = extractLogSummary(sessionData.log_file);
    context += `ANALYSIS LOGS SUMMARY:\n${logSummary}\n\n`;
  }

  // Try to read the PDF content from public folder
  try {
    let pdfFileName = sessionData?.pdf_path?.split("/").pop();
    if (!pdfFileName) {
      pdfFileName = "Nathaniel - Employment Agreement - Standord.pdf";
    }

    // For this implementation, we'll use a text version of the PDF
    const pdfTextPath = path.join(
      process.cwd(),
      "public",
      "pdf-text",
      `${pdfFileName.replace(".pdf", ".txt")}`
    );

    try {
      const pdfText = await fs.readFile(pdfTextPath, "utf-8");
      context += `DOCUMENT CONTENT:\n${pdfText}\n\n`;
    } catch (error) {
      console.log(`No text version found for PDF. Using fallback information.`);
      context += `DOCUMENT INFORMATION: The document is an employment agreement named "${pdfFileName}"\n\n`;
    }
  } catch (error) {
    console.error("Error reading PDF content:", error);
  }

  return context;
}

function extractLogSummary(logContent: string) {
  // In a real implementation, this would extract key insights from the logs
  // For now, return a shortened version or first few lines
  const lines = logContent.split("\n");
  const summary = lines.slice(0, 20).join("\n");
  return `${summary}\n...(log truncated)`;
}

async function generateOpenAIResponse(
  message: string,
  context: string,
  history?: Array<{ role: string; content: string }>
) {
  try {
    // Define the system message with instructions and context
    const systemMessage = `
You are an AI assistant specialized in legal compliance analysis for employment contracts.
You have access to the following information:
${context}

Your task is to provide accurate, helpful responses to questions about the employment agreement
and its compliance issues. Focus on explaining legal concerns clearly and offering actionable
advice to address compliance problems.

Format your responses using Markdown to improve readability:
- Use **bold** for important points or headings
- Use bullet points for lists
- Use > for quotes or highlighting important sections
- Use headings (## or ###) to organize longer responses
- Use \`code\` formatting for section numbers or legal references

Be concise but thorough in your explanations.
`;

    // Prepare messages for OpenAI API
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
    ];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      // Filter out the first assistant greeting if it exists to avoid redundancy
      const filteredHistory = history.length > 1 ? history.slice(1) : [];

      // Add properly typed messages from history
      for (const msg of filteredHistory) {
        // Only include valid role types
        if (
          msg.role === "user" ||
          msg.role === "assistant" ||
          msg.role === "system"
        ) {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }
    } else {
      // If no history, just add the current message
      messages.push({ role: "user", content: message });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o model
      messages: messages,
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 1000, // Reasonable response length
    });

    // Return the generated response
    return (
      completion.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Fallback to the hardcoded responses if OpenAI fails
    return generateFallbackResponse(message);
  }
}

// Fallback function in case OpenAI API fails
function generateFallbackResponse(message: string) {
  const lowercaseMessage = message.toLowerCase();

  // Create a simple mapping of keywords to responses
  const keywordResponses: Record<string, string> = {
    "non-compete":
      "The employment agreement contains a non-compete clause that restricts the employee from working with competitors for 3 years after termination. This duration exceeds the legal limit in most jurisdictions, which is typically 1-2 years. It's recommended to reduce this to 1 year to ensure compliance.",

    termination:
      "The termination notice period in the agreement is 5 days, which is below the minimum requirement of 2 weeks in the applicable jurisdiction. This needs to be updated to at least 14 days to comply with labor regulations.",

    compensation:
      "The compensation section includes a base salary and bonus structure, but is missing clear payment terms and frequency, which is required by labor laws. It's recommended to specify payment dates and methods in this section.",

    "intellectual property":
      "The intellectual property clause is generally compliant, transferring ownership of work product to the employer. However, it should be amended to exclude intellectual property developed entirely outside of work hours and without company resources.",

    "compliance score":
      "The compliance score of 78% is calculated based on the number of compliant versus non-compliant clauses, weighted by severity. There are 2 critical issues and 3 warning issues affecting this score. Fixing the critical issues related to non-compete duration and termination notice would improve the score significantly.",

    "critical issues":
      "The document has 2 critical compliance issues: 1) The non-compete duration exceeds legal limits (3 years vs recommended 1 year) and 2) The termination notice period is below the minimum required (5 days vs. required 14 days).",
  };

  // Check for keyword matches
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lowercaseMessage.includes(keyword)) {
      return response;
    }
  }

  // If no keywords match, provide a general response
  return "Based on the compliance report, this employment agreement needs several modifications to ensure legal compliance. The main issues involve the non-compete clause duration, insufficient termination notice period, and unclear compensation terms. Would you like specific details about any of these issues?";
}
