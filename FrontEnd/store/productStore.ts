/* Importation des fonctions d'appel API pour la récupération des produits et catégories, ainsi que des types associés  */
import { getCategories, getProducts, getProductsByCategory, searchProductsApi } from '@/lib/api';
/* Importation du type Product pour typer les objets produits dans le store */
import { Product } from '@/type';
/* Importation d'AsyncStorage pour permettre la persistance locale de l'état du store */
import AsyncStorage from '@react-native-async-storage/async-storage';
/* Importation de la fonction create de Zustand pour la création du store global */
import { create } from 'zustand';
/* Importation des middlewares de Zustand pour activer la persistance de l'état via AsyncStorage */
import { createJSONStorage, persist } from 'zustand/middleware';

/* L'interface ProductsState structure l'état du store produit */
interface ProductsState {
  products: Product[];                                                          // Liste complète des produits récupérés depuis l'API
  filteredProducts: Product[];                                                  // Liste des produits filtrés selon recherche/catégorie
  categories: string[];                                                         // Liste des catégories de produits disponibles
  loading: boolean;                                                             // Indique si une opération asynchrone est en cours
  error: string | null;                                                         // Message d'erreur en cas d'échec d'un appel API
  selectedCategory: string | null;                                              // Catégorie sélectionnée pour le filtrage
  fetchProducts: () => Promise<void>;                                           // Charge tous les produits depuis l'API
  fetchCategories: () => Promise<void>;                                         // Charge toutes les catégories depuis l'API
  setCategory: (category: string | null) => Promise<void>;                      // Définit la catégorie sélectionnée et filtre les produits
  searchProducts: (query: string) => void;                                      // Filtre les produits localement selon une requête
  sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;        // Trie les produits filtrés
  searchProductsRealTime: (query: string) => Promise<void>;                     // Recherche côté serveur en temps réel
}

/**
 * Création du store Zustand pour la gestion des produits, avec initialisation de l'état
 * et définition des méthodes asynchrones pour la gestion des produits et catégories.
 * La persistance via AsyncStorage peut être activée avec le middleware persist.
 */
export const useProductStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      // Initialisation de l'état du store avec des valeurs par défaut
      products: [],
      filteredProducts: [],
      selectedCategory: null,
      categories: [],
      loading: false,
      error: null,

      /**
       * Récupère tous les produits depuis l'API, met à jour l'état du store,
       * gère l'indicateur de chargement et capture les erreurs éventuelles.
       */
      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });
          const products = await getProducts();
          set({
            products,
            filteredProducts: products,
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      /**
       * Récupère toutes les catégories de produits depuis l'API et met à jour l'état.
       */
      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          const categories = await getCategories();
          set({ categories, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      /**
       * Définit la catégorie sélectionnée et filtre les produits en conséquence.
       * Si aucune catégorie n'est sélectionnée, réinitialise le filtre.
       */
      setCategory: async (category: string | null) => {
        try {
          set({ selectedCategory: category, loading: true, error: null });
          if (category) {
            const products = await getProductsByCategory(category);
            set({ filteredProducts: products, loading: false });
          } else {
            set({ filteredProducts: get().products, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      /**
       * Filtre localement les produits selon la requête de recherche et la catégorie sélectionnée.
       * Met à jour la liste des produits filtrés dans le store.
       */
      searchProducts: (query: string) => {
        const searchTerm = query.toLowerCase().trim();
        const { products, selectedCategory } = get();

        // Optimisation : on filtre d'abord par catégorie si besoin, puis on applique le filtre de recherche
        let filtered = selectedCategory
          ? products.filter((product) => product.category === selectedCategory)
          : products;

        if (searchTerm) {
          // Utilisation d'une RegExp pour une recherche plus performante et flexible (insensible à la casse)
          const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          filtered = filtered.filter(
            (product) =>
              regex.test(product.title) ||
              regex.test(product.description) ||
              regex.test(product.category)
          );
        }
        set({ filteredProducts: filtered });
      },

      /**
       * Trie la liste des produits filtrés selon le critère choisi (prix croissant, décroissant ou note).
       */
      sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => {
        const { filteredProducts } = get();
        let sorted = [...filteredProducts];
        switch (sortBy) {
          case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            sorted.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
          default:
            break;
        }
        set({ filteredProducts: sorted });
      },

      /**
       * Effectue une recherche de produits côté serveur en temps réel à partir d'une requête utilisateur.
       * Met à jour la liste des produits filtrés avec les résultats de l'API.
       * Si la requête est trop courte, réinitialise ou vide la liste filtrée.
       */
      searchProductsRealTime: async (query: string) => {
        try {
          set({ loading: true, error: null });
          if (query?.trim().length >= 3) {
            const searchResults = await searchProductsApi(query);
            set({ filteredProducts: searchResults, loading: false });
          } else if (!query.trim()) {
            set({ filteredProducts: get().products, loading: false });
          } else {
            set({ filteredProducts: [], loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    /**
     * À chaque fois qu'une méthode est utilisée et modifie l’une de ces propriétés,
     * @products, @filteredProducts, @categories, @selectedCategory,
     * Zustand va sauvegarder la nouvelle valeur dans AsyncStorage.
     * Quand l’application redémarre, Zustand recharge ces valeurs depuis AsyncStorage
     * et restaure l’état du store.
     */
    {
      name: 'product-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        products: state.products,
        filteredProducts: state.filteredProducts,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);