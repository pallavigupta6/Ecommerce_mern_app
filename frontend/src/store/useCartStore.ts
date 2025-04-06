import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon) => void;
  setCartItems: (items: CartItem[]) => void;
  // appliedCoupon: null,
//  setCoupon: (coupon) => set({ appliedCoupon: coupon }),
}
// store/useCartStore.ts
interface AppliedCoupon {
  code: string;
  discount: number;
  minValue: number;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  appliedCoupon: null,
  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),
  // removeItem: (productId) =>
  //   set((state) => ({
  //     items: state.items.filter((item) => item.product.id !== productId),
  //   })),
  // updateQuantity: (productId, quantity) =>
  //   set((state) => ({
  //     items: state.items.map((item) =>
  //       item.product.id === productId ? { ...item, quantity } : item
  //     ),
  //   })),
  clearCart: () => set({ items: [] }),
  setCoupon: (code) => set({ appliedCoupon: code }),
  setCartItems: (items) => set({ items }),
}));