import { connect } from "mongoose";

const config = {
  mongoDBUri: String(process.env.MONGODB_URI),
};

export const connectToDB = async () => {
  try {
    await connect(config.mongoDBUri, {});
  } catch (error) {
    console.log("Failed to connect to Database.", error);
  }
};

export default connectToDB;
