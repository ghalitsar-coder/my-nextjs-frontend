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

// Promotion interface
export interface Promotion {
  promotionId: number;
  name: string;
  description: string;
  discountValue: number; // This can be percentage or fixed amount
  minimumPurchaseAmount: number;
  maximumUses: number;
  currentUses: number;
  isActive: boolean;
  promotionType: "PERCENTAGE" | "FIXED_AMOUNT";
  maxDiscountAmount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  // Promotion state
  availablePromotions: Promotion[];
  selectedPromotions: number[];
  discountAmount: number;
  isLoadingPromotions: boolean;
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
  // Promotion actions
  setAvailablePromotions: (promotions: Promotion[]) => void;
  setSelectedPromotions: (promotionIds: number[]) => void;
  togglePromotion: (promotionId: number) => void;
  setDiscountAmount: (amount: number) => void;
  setIsLoadingPromotions: (loading: boolean) => void;
  calculatePromotionDiscount: () => number;
  clearPromotions: () => void;
  // New centralized API function
  fetchAvailablePromotions: () => Promise<void>;
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
      isOpen: false,
      // Promotion state
      availablePromotions: [],
      selectedPromotions: [],
      discountAmount: 0,
      isLoadingPromotions: false,

      // Actions
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
            newItems = [...state.items, newItem];          }

          const { totalItems, totalPrice } = calculateTotals(newItems);

          const newState = {
            items: newItems,
            totalItems,
            totalPrice,
          };

          // Recalculate promotion discount after cart change
          setTimeout(() => {
            get().calculatePromotionDiscount();
          }, 0);

          return newState;
        });
      },

      removeItem: (uniqueKey: string) => {        set((state) => {
          const newItems = state.items.filter(
            (item) => item.uniqueKey !== uniqueKey
          );
          const { totalItems, totalPrice } = calculateTotals(newItems);

          const newState = {
            items: newItems,
            totalItems,
            totalPrice,
          };

          // Recalculate promotion discount after cart change
          setTimeout(() => {
            get().calculatePromotionDiscount();
          }, 0);

          return newState;
        });
      },

      updateQuantity: (uniqueKey: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(uniqueKey);
          return;
        }        set((state) => {
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

          const newState = {
            items: newItems,
            totalItems,
            totalPrice,
          };

          // Recalculate promotion discount after cart change
          setTimeout(() => {
            get().calculatePromotionDiscount();
          }, 0);

          return newState;
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          // Clear promotions when cart is cleared
          selectedPromotions: [],
          discountAmount: 0,
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

      // Promotion actions
      setAvailablePromotions: (promotions: Promotion[]) => {
        set({ availablePromotions: promotions });
      },

      setSelectedPromotions: (promotionIds: number[]) => {
        set({ selectedPromotions: promotionIds });
        // Recalculate discount when promotions change
        get().calculatePromotionDiscount();
      },

      togglePromotion: (promotionId: number) => {
        set((state) => {
          const newSelectedPromotions = state.selectedPromotions.includes(
            promotionId
          )
            ? state.selectedPromotions.filter((id) => id !== promotionId)
            : [...state.selectedPromotions, promotionId];

          return { selectedPromotions: newSelectedPromotions };
        });
        // Recalculate discount after toggling
        get().calculatePromotionDiscount();
      },

      setDiscountAmount: (amount: number) => {
        set({ discountAmount: amount });
      },

      setIsLoadingPromotions: (loading: boolean) => {
        set({ isLoadingPromotions: loading });
      },

      calculatePromotionDiscount: () => {
        const { availablePromotions, selectedPromotions, totalPrice } = get();

        const selectedPromos = availablePromotions.filter((p) =>
          selectedPromotions.includes(p.promotionId)
        );

        const totalDiscount = selectedPromos.reduce((sum, promotion) => {
          let discount = 0;

          if (promotion.promotionType === "FIXED_AMOUNT") {
            discount = promotion.discountValue;
          } else {
            // Percentage discount
            const discountValue =
              promotion.discountValue > 1
                ? promotion.discountValue / 100
                : promotion.discountValue;
            discount = totalPrice * discountValue;
          }

          // Apply maximum discount limit if specified
          if (promotion.maxDiscountAmount && discount > promotion.maxDiscountAmount) {
            discount = promotion.maxDiscountAmount;
          }

          return sum + discount;
        }, 0);

        set({ discountAmount: totalDiscount });
        return totalDiscount;
      },      clearPromotions: () => {
        set({
          availablePromotions: [],
          selectedPromotions: [],
          discountAmount: 0,
          isLoadingPromotions: false,
        });
      },

      // Centralized API function for fetching promotions
      fetchAvailablePromotions: async () => {
        const { totalPrice, setAvailablePromotions, setIsLoadingPromotions } = get();
        
        if (totalPrice <= 0) {
          setAvailablePromotions([]);
          return;
        }

        setIsLoadingPromotions(true);
        try {
          const response = await fetch(
            `http://localhost:8080/api/orders/available-promotions?orderTotal=${totalPrice}`
          );
          if (response.ok) {
            const promotions = await response.json();
            setAvailablePromotions(promotions);
          } else {
            console.error("Failed to fetch promotions:", response.status);
            setAvailablePromotions([]);
          }
        } catch (error) {
          console.error("Error fetching promotions:", error);
          setAvailablePromotions([]);
        } finally {
          setIsLoadingPromotions(false);
        }
      },
    }),
    {
      name: "cart-storage", // unique name
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        // Include promotion state in persistence
        selectedPromotions: state.selectedPromotions,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
