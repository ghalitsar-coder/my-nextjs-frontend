import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  available?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subtotal: number;
  uniqueKey: string; // Add unique key to differentiate products
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (uniqueKey: string) => void;
  updateQuantity: (uniqueKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type CartStore = CartState & CartActions;

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isOpen: false, // Actions
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          // Create unique key combining id, name, and price
          const uniqueKey = `${product.id}-${product.name}-${product.price}`;
          const existingItem = state.items.find(
            (item) => item.uniqueKey === uniqueKey
          );

          let newItems: CartItem[];

          if (existingItem) {
            // Update existing item
            newItems = state.items.map((item) =>
              item.uniqueKey === uniqueKey
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: (item.quantity + quantity) * item.price,
                  }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
              subtotal: product.price * quantity,
              uniqueKey,
            };
            newItems = [...state.items, newItem];
          }

          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },
      removeItem: (uniqueKey: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.uniqueKey !== uniqueKey
          );
          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (uniqueKey: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(uniqueKey);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.uniqueKey === uniqueKey
              ? {
                  ...item,
                  quantity,
                  subtotal: item.price * quantity,
                }
              : item
          );

          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().totalItems;
      },

      getTotalPrice: () => {
        return get().totalPrice;
      },
    }),
    {
      name: "cart-storage", // unique name
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
