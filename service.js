import Chat from "./models/Chat.js";
import { sanitizeContent, chunkText } from "./utils.js";
import { storeChunks, searchSimilar } from "./vectorStore.js";
import { generateEmbedding, generateAnswer } from "./ai.js";

export async function askQuestion(url, rawContent, question, user) {

  const domain = new URL(url).hostname;

  let chat = await Chat.findOne({
    userId: user._id,
    domain
  });

  const history = chat?.messages.slice(-3) || [];

  const historyText = history
    .map(m => `Q: ${m.question}\nA: ${m.answer}`)
    .join("\n");

  const cleanContent = sanitizeContent(rawContent);
  const chunks = chunkText(cleanContent, 1000);

  await storeChunks(domain, chunks);

  const queryEmbedding = await generateEmbedding(question);
  const relevantChunks = await searchSimilar(domain, queryEmbedding, 5);

  const answer = await generateAnswer(
    relevantChunks,
    question,
    historyText  // pass conversation history
  );

  if (!chat) {
    chat = await Chat.create({
      userId: user._id,
      domain,
      messages: []
    });
  }

  chat.messages.push({
    question,
    answer: answer.answer
  });

  await chat.save();

  return answer;
}
