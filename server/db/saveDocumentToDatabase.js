import Document from "../Schema/Document.js";

export const saveDocumentToDatabase = async (documentID, data, title) => {
  try {
    const document = await Document.findOne({ id: documentID });
    if (!document) return "document not found";
    await Document.findOneAndUpdate(
      { id: documentID },
      {
        data,
        title,
      },
    );
    return {
      isError: false,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Failed to save changes into the database.", error);
    return {
      isError: true,
      isSuccess: false,
    };
  }
};
