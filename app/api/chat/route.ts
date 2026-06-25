import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY environment variable is not configured. Add it to .env.local."
      );
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, systemInstruction, model } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing or invalid 'messages' array" },
        { status: 400 }
      );
    }

    const ai = getAiClient();

    const contents = messages.map((m: Record<string, string>) => {
      let textContent = "";
      if (typeof m.content === "string") {
        textContent = m.content;
      } else if (m.c) {
        textContent = m.c;
      }

      let role = "user";
      if (m.role === "assistant" || m.role === "model" || m.r === "a") {
        role = "model";
      }

      return {
        role,
        parts: [{ text: textContent }],
      };
    });

    const selectedModel = model || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An error occurred while generating content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
