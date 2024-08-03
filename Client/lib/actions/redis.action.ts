"use server";
import { redis } from "../redis";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const cache = async (
  db_url: string,
  user_prompt: string,
  content: any
) => {
  try {
    const key = db_url + "_" + user_prompt;
    const expirationTime = 7200;
    await redis.set(key, content);
    await redis.expire(key, expirationTime);
  } catch (error) {
    console.error(error);
    throw new Error("Please Try Again.");
  }
};

export const checkKey = async (db_url: string, user_prompt: string) => {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const keys = await redis.keys(`${db_url}*`);
    const prompts = keys.map((key) => {
      const parts = key.split("_");
      return parts.length > 1 ? parts.slice(1).join("_") : "";
    });

    const gemini_prompts = prompts.map((prompt) => {
      return `I will give you two sentences. Just return me YES or NO, nothing else that whether they mean to say the same or not, dont match word by word. The first sentence is ${user_prompt}. The second prompt is ${prompt}`;
    });

    const results = await Promise.all(
      gemini_prompts.map((gemini_prompt) =>
        model.generateContent(gemini_prompt)
      )
    );

    for (let i = 0; i < results.length; i++) {
      const responseText = await results[i].response.text();
      const text = responseText.trim().toUpperCase();
      console.log("GEMINI RESPONSE", text);

      if (text === "YES") {
        const cached_key = keys[i];
        console.log("KEY", cached_key);

        const response = await redis.get(cached_key);
        console.log("RESPONSE", response);
        return response;
      }
    }

    return "FALSE";
  } catch (error) {
    console.error("Error in checkKey function:", error);
    throw new Error("Please Try Again.");
  }
};
