import { LIMIT } from "../config/index.js";
import Document from "../schema/Document.js";

export const getAllDocuments = async (userId, q, offset, limit) => {
  try {
    if (!userId) return "Unauthorized";
    const documents = await Document.find({
      userId: userId,
      title: { $regex: String(q ?? ""), $options: "i" },
    })
      .skip(Number(offset ?? 0))
      .limit(Number(limit ?? LIMIT))
      .sort({ updatedAt: -1 });

    return documents;
  } catch (error) {
    console.error("Failed to save changes into the database.", error);
    return error.message;
  }
};
