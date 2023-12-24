import Document from "../schema/Document.js";

const DEFAULT_VALUE = "Start typing ...";

export const findOrCreateDocument = async (documentID, userId, title) => {
  try {
    if (!documentID) return;
    const document = await Document.findOne({ id: documentID });
    if (document) return document;
    const newDocument = await Document.create({
      id: documentID,
      data: DEFAULT_VALUE,
      userId,
      title,
    });
    return newDocument;
  } catch (error) {
    console.error("Failed to find or create document", error);
  }
};
