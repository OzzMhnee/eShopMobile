import { create } from 'zustand';
import { Product } from '@/type';

interface FavoriteState {
  favoriteItems: Product[];
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoriteState>((set, get) => ({
  favoriteItems: [],
  isFavorite: (productId: number) => {
    return get().favoriteItems.some((item) => item.id === productId);
  },
  toggleFavorite: (product: Product) => {
    set((state) => {
      const exists = state.favoriteItems.some((item) => item.id === product.id);
      if (exists) {
        // Retirer des favoris
        return {
          favoriteItems: state.favoriteItems.filter((item) => item.id !== product.id),
        };
      } else {
        // Ajouter aux favoris
        return {
          favoriteItems: [...state.favoriteItems, product],
        };
      }
    });
  },
  clearFavorites: () => set({ favoriteItems: [] }),
}));