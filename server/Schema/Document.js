import { Schema, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    id: {
      type: String,
      require: [true, "id is required"],
    },
    title: {
      type: String,
      require: [true, "title is required"],
      default: "Untitled document",
    },
    data: {
      type: Object,
      require: [true, "data is required"],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamp: true,
  },
);

export const Document = model("Document", DocumentSchema);

export default Document;
