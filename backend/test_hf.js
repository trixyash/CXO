import dotenv from 'dotenv';
dotenv.config();
import { HfInference } from "@huggingface/inference";

const hfToken = process.env.HUGGINGFACE_API_KEY;
const hf = new HfInference(hfToken);

async function test() {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10 
      })
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Raw Response (first 100 chars):", text.substring(0, 100));
    try {
      const data = JSON.parse(text);
      console.log("Response JSON:", data);
    } catch (e) {
      console.log("Response is not JSON");
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

test();
