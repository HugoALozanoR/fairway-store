import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Order } from "../types/order";

export function useMyOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["orders", "me"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<Order[]>("/api/orders/me");
      return data;
    },
  });
}
