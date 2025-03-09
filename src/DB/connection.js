import mongoose from "mongoose";



const connectDB = async () => {
  console.log(process.env.DB_URI);
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};

export default connectDB;
