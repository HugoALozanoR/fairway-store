import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category } from "../types/catalog";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/api/categories");
      return data;
    },
    staleTime: 5 * 60_000,
  });
}
