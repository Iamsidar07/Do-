import { Doc } from "@/types/types";
import { forwardRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { convertToRelativeTime, deleteDocument } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buttonVariants } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";

interface DocumentProps {
  documents: Doc[] | undefined;
  isLoading: boolean;
  q: string | undefined;
}
const Document = forwardRef<HTMLDivElement, DocumentProps>(
  ({ documents, isLoading, q }, ref) => {
    const [currentRemovingItem, setCurrentRemovingItem] = useState<
      null | string
    >(null);
    const queryClient = useQueryClient();
    const { mutate: deleteDocumentFun, isPending: isRemovingItem } =
      useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
      });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2  lg:gap-3 pt-12 ">
        {" "}
        {documents && documents?.length > 0 && !isLoading && !q
          ? documents.map((doc, i) => {
              if (i === documents.length - 1)
                return (
                  <Card key={doc._id} ref={ref}>
                    <Link to={`/document/${doc.id}?title=${doc.title}`}>
                      <CardHeader>
                        <CardTitle className="truncate">
                          📁{doc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        className="truncate prose"
                        dangerouslySetInnerHTML={{ __html: doc.data }}
                      />
                    </Link>
                    <CardFooter className="justify-between">
                      <p>{convertToRelativeTime(new Date(doc.updatedAt))}</p>
                      <Button
                        onClick={() => {
                          setCurrentRemovingItem(doc._id);
                          deleteDocumentFun(doc._id);
                        }}
                        className={buttonVariants({
                          size: "sm",
                          variant: "destructive",
                        })}
                      >
                        {isRemovingItem && currentRemovingItem === doc._id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );

              return (
                <Card key={doc._id}>
                  <Link to={`/document/${doc.id}?title=${doc.title}`}>
                    <CardHeader>
                      <CardTitle className="truncate">📁{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent
                      className="truncate prose"
                      dangerouslySetInnerHTML={{ __html: doc.data }}
                    />
                  </Link>
                  <CardFooter className="justify-between">
                    <p>{convertToRelativeTime(new Date(doc.updatedAt))}</p>
                    <Button
                      onClick={() => {
                        setCurrentRemovingItem(doc._id);
                        deleteDocumentFun(doc._id);
                      }}
                      className={buttonVariants({
                        size: "sm",
                        variant: "destructive",
                      })}
                    >
                      {isRemovingItem && currentRemovingItem === doc._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          : null}
      </div>
    );
  },
);

Document.displayName = "Documents";

export default Document;
