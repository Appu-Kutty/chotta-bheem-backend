import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return response.data[0].embedding;
}

export async function generateAnswer(chunks, question, historyText) {

  const context = chunks.join("\n\n");

  const prompt = `
You are an AI assistant.

Previous conversation:
${historyText}

Answer ONLY using the context below.

Context:
${context}

Question:
${question}

Return JSON format:
{
  "answer": "...",
  "sources": ["sentence1", "sentence2"]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(completion.choices[0].message.content);
}
