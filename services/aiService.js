import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const categorizeIssue = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Classify this civic issue into ONE category:
    [Road, Lighting, Flooding, Safety, Waste, Other]

    Issue: ${description}
    `;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();

    return text;
  } catch {
    return "Other";
  }
};