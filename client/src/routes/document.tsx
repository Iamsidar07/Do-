import { socket } from "../socket.js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Input } from "@/components/ui/input.js";
import toast from "react-hot-toast";
import { Check, Share } from "lucide-react";
import { Button } from "@/components/ui/button.js";

interface SaveDocumentResponse {
  isError: boolean;
  isSuccess: boolean;
}

export default function Document() {
  const { documentId } = useParams();
  const { user } = useKindeAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [isClickedOnCopyurl, setIsClickedOnCopyurl] = useState(false);
  const prevContentRef = useRef(content);
  const [documentTitle, setDocumentTitle] = useState(
    searchParams.get("title") ?? "",
  );
  const prevTitleRef = useRef(documentTitle);

  const [isSocketConnected, setIsSocketConnected] = useState(socket?.connected);
  useEffect(() => {
    if (!socket) return;
    function onConnect() {
      setIsSocketConnected(true);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    function onReceiveChangesEvent(delta: string) {
      setContent(delta);
    }

    function onLoadDocumentEvent(doc: string) {
      setContent(doc);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-changes", onReceiveChangesEvent);
    socket.once("load-document", onLoadDocumentEvent);
    socket.emit("get-document", { documentID: documentId, userID: user?.id });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-changes", onReceiveChangesEvent);
      socket.off("load-document", onLoadDocumentEvent);
    };
  }, [user?.id, documentId]);

  useEffect(() => {
    function onSaveDocumentResponse(response: SaveDocumentResponse) {
      console.log("received save:");
      if (response.isError) {
        toast.error("Something went wrong!");
      }
      if (response.isSuccess) {
        toast.success("Successfully saved.");
      }
    }

    socket.on("save-document-response", onSaveDocumentResponse);
    return () => { socket.off("save-document-response", onSaveDocumentResponse); }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSocketConnected) return;
      if (
        prevContentRef.current !== content ||
        prevTitleRef.current !== documentTitle
      ) {
        console.log("emiited save:");
        socket.emit("save-document", {
          title: documentTitle ?? "Untitled",
          data: content,
        });
        prevContentRef.current = content;
        prevTitleRef.current = documentTitle;
      }
    }, 2500);
    return () => {
      clearInterval(interval);
    };
  }, [content, documentTitle, isSocketConnected]);

  useEffect(() => {
    if (window) {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-1.5">
      <div className="flex items-center gap-2">
        <Input
          id="name"
          className="my-1.5"
          value={documentTitle}
          placeholder="Untitled document"
          onChange={(e) => {
            setDocumentTitle(e.target.value);
            setSearchParams((params) => {
              params.set("title", e.target.value);
              return params;
            });
          }}
        />
        <Button
          onClick={() => {
            setIsClickedOnCopyurl(true);
            navigator.clipboard.writeText(url ?? "");
            toast.success("🔗 Link copied Successfully.");
            setTimeout(() => setIsClickedOnCopyurl(false), 900);
          }}
          className="flex items-center gap-1.5"
        >
          {" "}
          <span>Share</span>
          {isClickedOnCopyurl ? (
            <Check className="w-4 h-4" />
          ) : (
            <Share className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="prose max-w-5xl!">
        {" "}

      </div>
      <CKEditor
        editor={ClassicEditor}
        data={content ?? ""}
        onReady={(editor) => {
          console.log("CKEditor5 React Component is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          socket.emit("send-changes", data);
          console.log(event);
          setContent(data);
        }}
      />
    </div>
  );
}
