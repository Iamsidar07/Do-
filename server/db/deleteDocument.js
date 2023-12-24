import Document from "../schema/Document.js";

export const deleteDocument = async (documentID) => {
  try {
    if (!documentID) return;
    const isDocument = await Document.findById(documentID);
    if (!isDocument) return "Document not found";
    const document = await Document.findByIdAndRemove(documentID);
    return document;
  } catch (error) {
    console.error("Failed to delete document", error);
  }
};
