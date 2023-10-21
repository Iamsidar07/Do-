import Document from "../Schema/Document.js";

export const saveDocumentToDatabase = async (documentID, data, title) => {
  try {
    console.log(typeof Date.now());
    await Document.findByIdAndUpdate(documentID, {
      data,
      title,
    });
    console.log("Saved changes to DB.", data);
  } catch (error) {
    console.log("Failed to save changes into the database.", error);
  }
};
