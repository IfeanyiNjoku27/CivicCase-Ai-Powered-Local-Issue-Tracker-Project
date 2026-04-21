import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Issue from "../models/Issue.js";
import connectDB from "../lib/db.js";

import { createAgent } from "langchain";
/* 
// Person B: Issue Categorization 
*/
const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

export const categorizeIssue = async (description) => {
  try {
    const prompt = `
    Classify this civic issue into ONE category strictly from this list:
    [Road, Lighting, Flooding, Safety, Waste, Other]

    Issue: ${description}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error categorizing issue:", error);
    return "Other"; // safe fallback category
  }
};

/**
 * Person A: Langraph agent chatbot
 */

// fetch open issues from database
const getOpenIssues = tool(
  async () => {
    await connectDB();
    // fetch issues that are no resolved, limiting it to 5 for performance
    const issues = await Issue.find({ status: { $ne: "Resolved" } })
      .limit(5)
      .lean();

    if (!issues || issues.length === 0)
      return "No open issues found in the database.";

    // return a condensed string for the agent to read
    return JSON.stringify(
      issues.map((i) => ({ title: i.title, status: i.status })),
    );
  },

  {
    name: "get_open_issues",
    description:
      "Retreives a list of currently open civic issues in the municipality.",
    schema: z.object({}),
  },
);

// saftey alerts
const getSafetyAlerts = tool(
  async () => {
    // mock active alert
    return "Active Safety Alert: Road closure on Main St due to flooding.";
  },
  {
    name: "get_safety_alerts",
    description:
      "Retrevies active emergency saftey alerts for the neighborhood.",
    schema: z.object({}),
  },
);

const tools = [getOpenIssues, getSafetyAlerts];

// initialize the Langchain agent wrapper
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flast",
  temperature: 0, // 0 means agent becomes more factual and hallunination less
});

// create langraph agent
const agent = createAgent({
  model: model,
  tools: tools,
  systemPrompt:
    "You are a helpful municipal assistant. Use your tools to answer questions about local issues and safety alerts. Be concise, polite, and helpful.",
});

// export execution function for the agent
export const chatWithAgent = async (message) => {
  try {
    const result = await agent.invoke({ messages: [["user", message]] });

    // agent returns an array of messages.
    // only need the final text response to the user
    return result.messages[result.messages.length - 1].content;
  } catch (error) {
    console.error("Error chatting with agent:", error);
    throw new Error(
      "The municipal AI assistant is currently unavailable. Please try again later.",
    );
  }
};
