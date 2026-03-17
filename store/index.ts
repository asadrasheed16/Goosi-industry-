// store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Profile } from '@/types';

// ---- CART STORE ----
interface CartStore {
  items: (CartItem & { products: Product })[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product_id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, {
              id: crypto.randomUUID(),
              user_id: '',
              product_id: product.id,
              quantity,
              products: product,
            }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.product_id !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter(i => i.product_id !== productId)
            : state.items.map(i => i.product_id === productId ? { ...i, quantity } : i),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + (i.products?.price || 0) * i.quantity, 0),
    }),
    { name: 'goosi-cart', partialize: (state) => ({ items: state.items }) }
  )
);

// ---- AUTH STORE ----
interface AuthStore {
  user: Profile | null;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  isAdmin: () => get().user?.role === 'admin',
}));

// ---- UI STORE ----
interface UIStore {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId],
        })),
      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    { name: 'goosi-ui', partialize: (state) => ({ wishlist: state.wishlist }) }
  )
);
