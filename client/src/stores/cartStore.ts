import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/cart";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const qty = Math.max(1, Math.floor(quantity));
          const existing = state.items.find((i) => i.productId === item.productId);
          const stockCap = Math.max(0, item.stock);

          if (existing) {
            const nextQty = Math.min(existing.quantity + qty, stockCap);
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: nextQty, price: item.price, stock: item.stock }
                  : i
              ),
            };
          }

          if (stockCap <= 0) return state;
          return {
            items: [...state.items, { ...item, quantity: Math.min(qty, stockCap) }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.productId !== productId) return i;
              const capped = Math.min(Math.max(1, Math.floor(quantity)), Math.max(1, i.stock));
              return { ...i, quantity: capped };
            }),
        })),

      clear: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: "fairway-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
