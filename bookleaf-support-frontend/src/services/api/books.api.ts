"use client";

import { http } from "./client";
import type { Paginated, PaginationParams } from "@/types/api";
import type { Book } from "@/types/book";

export const booksApi = {
  list: (params?: PaginationParams) => http.get<Paginated<Book>>("/books", params),
  get: (id: string) => http.get<Book>(`/books/${id}`),
} as const;
