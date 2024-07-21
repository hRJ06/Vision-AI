import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";
import { uploadImageToCloudinary } from "../utils/ImageUpload.js";

const router = express.Router();
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateContent(imageUrl, userPrompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
        `You are an expert in ER diagram analysis or database visualization. Based on the image provided at ${imageUrl}, ${userPrompt}. If the image is not a proper ER diagram, respond with a message indicating that a valid ER diagram image is required. Please add \n as delimeter for new line and corresponding delimter for bold, bullet points and list numbers.`;
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


        const defaultPrompt = "provide the corresponding SQL code as per the relationships and schema depicted";
        const generatedContent = await generateContent(imageUrl,defaultPrompt);

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
        const generatedContent = await generateContent(imageUrl, userPrompt);
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
export default router;
