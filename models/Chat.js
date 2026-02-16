import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: String,
  domain: String,
  messages: [
    {
      question: String,
      answer: String
    }
  ]
});

export default mongoose.model("Chat", chatSchema);
