import express from "express";
import { Server } from "socket.io";
import connectToDB from "./db/connectToDB.js";
import { findOrCreateDocument } from "./db/findOrCreateDocument.js";
import { saveDocumentToDatabase } from "./db/saveDocumentToDatabase.js";
import { deleteDocument } from "./db/deleteDocument.js";
import { createServer } from "http";
import * as dotenv from "dotenv";
import { getAllDocuments } from "./db/getAllDocuments.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

await connectToDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/all", async (req, res) => {
  console.log(req.url);
  const { userId, q, offset, limit } = req.query;
  const allDocuments = await getAllDocuments(userId, q, offset, limit);
  res.json({
    results: allDocuments,
  });
});

app.delete("/document", async (req, res) => {
  const { documentId } = req.query;
  if (!documentId) {
    res.json({
      message: "documentId is empty ",
    });
  }
  const document = await deleteDocument(documentId);
  res.json({
    results: document,
  });
});

io.on("connection", (socket) => {
  socket.on("get-document", async ({ documentID, userID, title }) => {
    const doc = await findOrCreateDocument(documentID, userID, title);
    socket.join(documentID);
    socket.emit("load-document", doc?.data);
    // Listen for send-changes event from client.
    socket.on("send-changes", (delta) => {
      // Broadcast changes to everyone except for us.
      socket.broadcast.to(documentID).emit("receive-changes", delta);
      // socket.broadcast.emit("receive-changes", delta);
    });

    // Listen for save-document events to save document in the Database
    socket.on("save-document", async ({ data, title }) => {
      const response = await saveDocumentToDatabase(documentID, data, title);
      console.log("receive");
      socket.emit("save-document-response", response);
      console.log("send");
    });
  });
});

server.listen(3001, () => console.log("Server has started at port: 3001"));
