//index.js

import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const conversationHistory = [];

const addToHistory = (role, content) => {
  conversationHistory.push({ role, content });
  if (conversationHistory.length > 20) {
    conversationHistory.shift();
  }
};

let GPT4 = async (message) => {
  addToHistory('user', message);
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: conversationHistory,
  });
  const botMessage = response.choices[0].message.content;
  addToHistory('assistant', botMessage);
  return botMessage;
};

app.post('/message', async (req, res) => {
  try {
    console.log("Received message:", req.body.message);
    const userMessage = req.body.message;
    if (userMessage.trim()) {
      const botReply = await GPT4(userMessage);
      res.json({ message: botReply });
    } else {
      res.json({ message: "Please send a non-empty message." });
    }
  } catch (error) {
    console.error("Error in /message route:", error); // Log errors for debugging
    res.status(500).send(error.message);
  }
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});