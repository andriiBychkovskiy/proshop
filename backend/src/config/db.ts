import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log("mongo", conn.connection.host);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log("An unknown error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;
