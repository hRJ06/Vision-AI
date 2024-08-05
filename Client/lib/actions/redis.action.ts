"use server";
import { redis } from "../redis";
import {
  CACHE_RESPONSE_SET,
  generate_redis_cache_check_prompt,
  getModel,
  REDIS_EXPIRATION_TIME,
} from "../utils";

export const cache = async (
  db_url: string,
  user_prompt: string,
  content: any
) => {
  try {
    const key = db_url + "_" + user_prompt;
    await redis.set(key, content);
    await redis.expire(key, REDIS_EXPIRATION_TIME);
  } catch (error) {
    console.error(error);
    throw new Error("Please Try Again.");
  }
};

export const checkKey = async (db_url: string, user_prompt: string) => {
  const model = getModel();

  try {
    const keys = await redis.keys(`${db_url}*`);
    const prompts = keys.map((key) => {
      const parts = key.split("_");
      return parts.length > 1 ? parts.slice(1).join("_") : "";
    });

    const gemini_prompts = prompts.map((prompt) => {
      return generate_redis_cache_check_prompt(user_prompt, prompt);
    });

    const results = await Promise.all(
      gemini_prompts.map((gemini_prompt) =>
        model.generateContent(gemini_prompt)
      )
    );

    for (let i = 0; i < results.length; i++) {
      const responseText = results[i].response.text();
      const text = responseText.trim().toUpperCase();
      if (CACHE_RESPONSE_SET.has(text)) {
        const cached_key = keys[i];
        const response = await redis.get(cached_key);
        return response;
      }
    }

    return "FALSE";
  } catch (error) {
    console.error(error);
    throw new Error("Please Try Again.");
  }
};
