import Document from "../Schema/Document.js";

const DEFAULT_VALUE = "Start typing ...";

export const findOrCreateDocument = async (documentID, userID) => {
  try {
    if (!documentID || !userID) return;
    const document = await Document.findById(documentID);
    if (document) return document;
    const newDocument = await Document.create({
      id: documentID,
      data: DEFAULT_VALUE,
      creator: userID,
    });
    return newDocument;
  } catch (error) {
    console.log("Failed to find or create document", error);
  }
};
