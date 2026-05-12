import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Order } from "../types/order";

export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<Order>(`/api/orders/${id}`);
      return data;
    },
  });
}
