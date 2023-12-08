import { socket } from "../socket.js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Input } from "@/components/ui/input.js";
import toast from "react-hot-toast";
import { Check, Loader2, Share } from "lucide-react";
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
  const [isSaving, setIsSaving] = useState(false);

  const [documentTitle, setDocumentTitle] = useState(
    searchParams.get("title") ?? "",
  );


  const [, setIsSocketConnected] = useState(socket?.connected);
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
      setIsSaving(false);
      if (response.isError) {
        toast.error("Something went wrong!");
      }
    }

    socket.on("save-document-response", onSaveDocumentResponse);
    return () => { socket.off("save-document-response", onSaveDocumentResponse); }
  }, []);


  useEffect(() => {
    if (window) {
      setUrl(window.location.href);
    }
  }, []);

  const debounce = function (cb: { (): void; (arg0: unknown[]): void; }, delay = 500) {
    let timeout: NodeJS.Timeout | undefined;
    return function (...args: unknown[]) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(args)
      }, delay)
    }
  }
  const handleSaveToDatabase = function () {
    setIsSaving(true);
    socket.emit("save-document", { title: documentTitle, data: content })
  }

  const saveToDatabase = debounce(handleSaveToDatabase, 500);

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
      <div className="absolute w-12 h-12 bg-blue-600 rounded-full bottom-6 right-6 p-2 shadow">
        <Loader2 className={`w-full h-full text-white ${isSaving ? "animate-spin" : ""}`} />
      </div>
      <CKEditor
        editor={ClassicEditor}
        data={content ?? ""}
        onChange={(_, editor) => {
          const data = editor.getData();
          socket.emit("send-changes", data);
          setContent(data);
          saveToDatabase()
        }}
      />
    </div>
  );
}
