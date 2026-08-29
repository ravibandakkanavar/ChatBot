import { askChatbot } from "../../../src/chatbot.js";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await askChatbot(prompt, "You are a helpful assistant.");
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
