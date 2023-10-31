import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const config = {
  mongoDBUri: String(process.env.MONGODB_URI),
};

export const connectToDB = async () => {
  try {
    await connect(config.mongoDBUri, {});
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the Database.", error);
    throw new Error("Failed to connect to the Database.");
  }
};

export default connectToDB;
