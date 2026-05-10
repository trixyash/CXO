import express from "express";
import { HfInference } from "@huggingface/inference";

const router = express.Router();

router.post("/", async (req, res) => {
  const { messages } = req.body;
  const hfToken = process.env.HUGGINGFACE_API_KEY;

  if (!hfToken) {
    return res.status(500).json({ error: "Hugging Face API Key is not configured on the server." });
  }

  try {
    const hf = new HfInference(hfToken);
    const template = `You are TARS, the official AI assistant for CXO Connect. CXO Connect is an exclusive network bridging forward-thinking companies and elite fractional leaders (like fractional CMOs, CFOs, etc.).
Your strict rules:
1. ONLY answer questions regarding CXO Connect, finding fractional leaders, or joining the network.
2. If asked ANYTHING outside the usage of the website's core (e.g., coding, general knowledge, math, unrelated advice), you must politely decline and state that you can only assist with CXO Connect related inquiries.
3. Keep your answers concise, professional, and helpful.
4. NEVER use markdown bold (**) or italic (*) marks anywhere in your response. Keep the text clean.
5. If your answer is in points, format it nicely with standard bullet points.
6. All answers MUST be under 100 words.`;

    const result = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: template },
        ...messages
      ],
      max_tokens: 180,
      temperature: 0.1
    });

    const finalResponse = result.choices[0].message.content.trim().replace(/\*/g, '');
    res.json({ content: finalResponse });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to connect to AI service." });
  }
});

export default router;
