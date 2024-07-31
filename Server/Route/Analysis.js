import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";
import { uploadImageToCloudinary } from "../utils/ImageUpload.js";
import OpenAI from "openai";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const router = express.Router();
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateContent(imageUrl, userPrompt) {
  const prompt = `You are an expert in ER diagram analysis or database visualization. Based on the image provided at ${imageUrl}, ${userPrompt}. If the image is not a proper ER diagram, respond with a message indicating that a valid ER diagram image is required. Please add \n as delimeter for new line and corresponding delimter for bold, bullet points and list numbers.`;
  const imageParts = await fetchImage(imageUrl);
  const result = await model.generateContent([prompt, imageParts]);
  const response = await result.response;
  const text = await response.text();
  console.log(text);
  return text;
}

async function fetchImage(url) {
  const fetchModule = await import("node-fetch");
  const fetch = fetchModule.default;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType: response.headers.get("content-type"),
    },
  };
}

router.post("/image-analysis", async (req, res) => {
  try {
    const image = req.files?.image;
    console.log("image-->", image);

    if (!image) {
      return res.status(400).json({
        message: "Image file not provided",
        success: false,
      });
    }

    const uploadDetails = await uploadImageToCloudinary(image, "uploads");
    const imageUrl = uploadDetails.secure_url;
    console.log("Image URL->", imageUrl);

    const defaultPrompt =
      "provide the corresponding SQL code as per the relationships and schema depicted";
    const generatedContent = await generateContent(imageUrl, defaultPrompt);

    return res.status(200).json({
      message: "Image analysis successful",
      imageUrl: imageUrl,
      generatedContent: generatedContent,
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error analyzing image",
      success: false,
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { imageUrl, userPrompt } = req.body;
    const modifiedPrompt = `${userPrompt}. Please consider this as a valid ER design.`;
    const generatedContent = await generateContent(imageUrl, modifiedPrompt);
    return res.status(200).json({
      message: "Chat response successful",
      generatedContent: generatedContent,
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error generating content",
      success: false,
    });
  }
});

router.post("/report", async (req, res) => {
  const data = req.body;

  if (!data) {
    return res
      .status(400)
      .json({ status: "error", message: "No data provided" });
  }

  const {
    User: user,
    Password: password,
    Host: host,
    Port: port,
    Database: database,
    schemaDescription: schemaDescription,
  } = data;

  if (!user || !password || !host || !port || !database) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
  }

  try {
    const prompts = [
      `Provide 6 vulnerabilities of the schema. The schema is ${schemaDescription}. Please only give response in 6 points with proper Markdown formatting, and don't ask further questions. Just provide the response.`,
      `Provide the normal form of the schema. The schema is ${schemaDescription}. Please only give the normal form, nothing else, with proper Markdown formatting, and don't ask further questions. Just provide the response.`,
      `Provide 6 Scope of Improvements of the schema. The schema is ${schemaDescription}. Please only give response in 6 points with proper Markdown formatting, and don't ask further questions. Just provide the response.`,
    ];
    const responses = [];

    for (let i = 0; i < prompts.length; i++) {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompts[i] },
        ],
        model: "gpt-4o-mini",
      });
      responses.push(completion.choices[0].message.content);
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Vision AI Report", { align: "center" })
      .moveDown(2);
    responses.forEach((item) => {
      let parts = item.split(/\*\*(.*?)\*\*/);
      let isBold = false;
      parts.forEach((part, index) => {
        if (!(index % 2)) {
          if (part.trim().startsWith("- ") || part.trim().startsWith("1. ")) {
            const lines = part.split("\n").filter((line) => line.trim() !== "");
            lines.forEach((line, idx) => {
              if (idx > 0) doc.moveDown(0.5);
              doc.fontSize(12).font("Helvetica").text(line, { align: "left" });
            });
          } else {
            doc.fontSize(12).font("Helvetica").text(part, { align: "left" });
          }
        } else {
          doc.fontSize(12).font("Helvetica-Bold").text(part, { align: "left" });
        }
      });

      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 3000,
      temperature: 0,
    });
    const generatedContent = completion.choices[0].text;
    return res.status(200).json({
      message: "Chat Response Successful",
      generatedContent: generatedContent,
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error generating content",
      success: false,
    });
  }
});
export default router;
