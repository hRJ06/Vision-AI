import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { cloudinaryConnect } from "./config/Cloudinary.js";
import imageAnalysis from "./Route/Analysis.js";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
    })
);

app.use(express.json());

cloudinaryConnect();


app.use("/image", imageAnalysis);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
});
