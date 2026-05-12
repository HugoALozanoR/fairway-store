import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { PagedResult, ProductQuery, ProductSummary } from "../types/catalog";

function buildParams(q: ProductQuery): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (q.category) params.category = q.category;
  if (q.minPrice !== undefined) params.minPrice = q.minPrice;
  if (q.maxPrice !== undefined) params.maxPrice = q.maxPrice;
  if (q.search) params.search = q.search;
  if (q.sort && q.sort !== "newest") params.sort = q.sort;
  if (q.page) params.page = q.page;
  if (q.pageSize) params.pageSize = q.pageSize;
  return params;
}

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const { data } = await api.get<PagedResult<ProductSummary>>(
        "/api/products",
        { params: buildParams(query) }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
