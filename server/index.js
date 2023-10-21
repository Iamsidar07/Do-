import { Server } from "socket.io";
import connectToDB from "./db/connectToDB.js";
import { findOrCreateDocument } from "./db/findOrCreateDocument.js";
import { saveDocumentToDatabase } from "./db/saveDocumentToDatabase.js";
import * as dotenv from "dotenv";

dotenv.config();
const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

await connectToDB();

io.on("connection", (socket) => {
  console.log("Connected to the server.", socket.id);
  socket.on("get-document", async (documentID, userID) => {
    const doc = await findOrCreateDocument(documentID, userID);
    socket.join(documentID);
    socket.emit("load-document", doc?.data);
    // Listen for send-changes event from client.
    socket.on("send-changes", (delta) => {
      console.log(delta);
      // Broadcast changes to everyone except for us.
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });

    // Listen for save-document events to save document in the Database
    socket.on("save-document", async (data, title) => {
      await saveDocumentToDatabase(documentID, data, title);
    });
  });
});
