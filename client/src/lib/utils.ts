import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Doc } from "@/types/types";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { INIFINITE_QUERY_LIMIT, baseUrl } from "@/config";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAllDocuments(
  userId: string | undefined | null,
  q: string,
): Promise<Doc[]> {
  try {
    if (!userId) return [];
    let url = `${baseUrl}/all?userId=${userId}`;
    if (q) url = url.concat(`&q=${q}`);
    const res = await axios.get(url);
    const documents: Doc[] = res.data.results;

    return documents;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return error.message;
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const res = await axios.delete(
      `${baseUrl}/document?documentId=${documentId}`,
    );
    const document: Doc = res.data;
    return document;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return error.message;
  }
}

export function convertToRelativeTime(date: Date): string {
  return dayjs(date).fromNow();
}

export function generateURL(userId: string, offset: number) {
  return `${baseUrl}/all?userId=${userId}&offset=${offset}&limit=${INIFINITE_QUERY_LIMIT}`;
}

