import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ProductDetail } from "../types/catalog";

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data } = await api.get<ProductDetail>(`/api/products/${slug}`);
      return data;
    },
  });
}
