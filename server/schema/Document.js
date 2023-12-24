import { Schema, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: [true, "id is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
      default: "Untitled document",
    },
    data: {
      type: String,
      required: [true, "data is required"],
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Document = model("Document", DocumentSchema);

export default Document;
