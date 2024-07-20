import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


export const uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    console.log("OPTIONS", options);
    console.log("File Path:", file.tempFilePath);

    try {
        // Check if file exists
        if (fs.existsSync(file.tempFilePath)) {
            console.log("File exists");
        } else {
            console.error("File does not exist");
            throw new Error("File does not exist at the given path");
        }

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};
