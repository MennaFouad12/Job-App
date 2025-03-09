import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import path from 'path';
const envPath = path.resolve('./src/config/.env'); // Resolve the absolute path
console.log("Resolved .env path:", envPath); //
dotenv.config({ path: envPath });
console.log(process.env.CLOUDINARY_NAME);
console.log(process.env.API_KEY);
console.log(process.env.API_SECRET);
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;