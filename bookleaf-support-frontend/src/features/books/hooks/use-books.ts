"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { booksApi } from "@/services/api/books.api";

export function useBooks(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => booksApi.list(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => booksApi.get(id),
    enabled: !!id,
  });
}
