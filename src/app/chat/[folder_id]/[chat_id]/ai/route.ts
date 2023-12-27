import { NextResponse } from "next/server";
import { GoogleGenerativeAIStream, StreamingTextResponse, Message } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiChatRole } from "@/lib/chats/types";
import { CONFIG } from "@/config";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});

export async function POST(request: Request) {
  try {
    const { messages: _messages } = await request.json();

    const messages = _messages.filter((i) => i.role !== GeminiChatRole.WELCOME);

    if (!messages?.length) throw new Error("No message found");

    const geminiStream = await genAI
      .getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          ...CONFIG.geminiAI,
        },
      })
      .generateContentStream(buildGoogleGenAIPrompt(messages));

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: e.message || "Something went wrong! please try again",
      },
      {
        status: 401,
      }
    );
  }
}
