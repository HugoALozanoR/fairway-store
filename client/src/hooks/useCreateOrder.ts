import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../lib/api";
import type { CreateOrderRequest, Order } from "../types/order";

export class CreateOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateOrderError";
  }
}

export function useCreateOrder() {
  return useMutation<Order, CreateOrderError, CreateOrderRequest>({
    mutationFn: async (payload) => {
      try {
        const { data } = await api.post<Order>("/api/orders", payload);
        return data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as { message?: string } | undefined;
          throw new CreateOrderError(
            data?.message ?? "We couldn’t place your order. Please try again."
          );
        }
        throw new CreateOrderError("Unexpected error placing the order.");
      }
    },
  });
}

