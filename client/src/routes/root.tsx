import { Link, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllDocuments } from "@/lib/utils";

import { Loader, PlusIcon } from "lucide-react";
import axios from "axios";
import { useIntersection } from "@mantine/hooks";
import Document from "@/components/Document";
import { Doc } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { INIFINITE_QUERY_LIMIT } from "@/config";

export default function Root() {
  const [title, setTitle] = useState<string>("");
  const [searchParams] = useSearchParams();
  const { user } = useKindeAuth();
  const userId = user?.id;
  const q = searchParams.get("q") ?? "";
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastElementRef.current,
    threshold: 1,
  });
  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isErrorWhileSearching,
    refetch: refetchSearchResult,
  } = useQuery({
    queryKey: ["documents", userId, q],
    queryFn: async () => await getAllDocuments(userId, q),
    enabled: Boolean(q && userId),
  });


  const {
    data,
    error,
    fetchNextPage,
    refetch: refetchDocuments,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["documents", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam ? pageParam : 0;
      const url = `${import.meta.env.VITE_API_BASE_URL}/all?userId=${userId}&offset=${offset}&limit=${INIFINITE_QUERY_LIMIT}`;
      const data = await axios.get(url);
      return {
        results: data.data.results,
        offset: offset + INIFINITE_QUERY_LIMIT,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.offset,
  });

  const documents: Doc[] = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.results) : []),
    [data],
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <section className="max-w-5xl mx-auto pt-12 md:pt-24 w-full px-1.5 md:px-5 ">
        {" "}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-44 h-44">
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Create Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new document</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please provide a title for your document and click on "Create"
              button to proceed.{" "}
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <Input
                id="name"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Link
                to={`/document/${nanoid()}?title=${title}`}
                className={buttonVariants({
                  variant: "default",
                })}
              >
                Create
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>{" "}
        <Document
          documents={q ? searchResults : documents}
          ref={ref}
          isLoading={q ? isSearching : isLoading}
          q={q}
        />
        <div className="flex flex-col items-center gap-2.5 text-center">
          {" "}
          {isLoading ? (
            <div className="grid place-items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <h2>Setting up your workspace...</h2>
            </div>
          ) : null}
          {!isLoading && documents?.length === 0 ? (
            <div>
              <h2>Seems like empty</h2>
              <p>Create your first doc...</p>
            </div>
          ) : null}
          {error ? (
            <div>
              <h2>Oops! Something went wrong!</h2>
              <p>
                Please{" "}
                <span
                  className="font-bold underline cursor-pointer"
                  onClick={() => refetchDocuments()}
                >
                  try again
                </span>{" "}
                later...
              </p>
            </div>
          ) : null}
          {isSearching ? (
            <div className="grid place-items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <h2>Searching for "${q}"</h2>
            </div>
          ) : null}
          {!isSearching && searchResults && searchResults?.length === 0 ? (
            <div>
              <h2>No Search result found</h2>
              <p>No result for ${q}</p>
            </div>
          ) : null}
          {isErrorWhileSearching ? (
            <div>
              <h2>Oops! Something went wrong while searching...</h2>
              <p>
                Please{" "}
                <span
                  className="font-bold underline cursor-pointer"
                  onClick={() => refetchSearchResult()}
                >
                  try again
                </span>{" "}
                later...
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
