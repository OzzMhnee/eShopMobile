//Import des fonctions d'API et des types nécessaires
import { getCategories, getProducts, getProductsByCategory, searchProductsApi } from '@/lib/api';
//Import du type Product
import { Product } from '@/type';
//Import des bibliothèques nécessaires pour la gestion de l'état avec persistance
import AsyncStorage from '@react-native-async-storage/async-storage';
//Zustand pour la gestion de l'état, création du store
import { create } from 'zustand';
//Middleware pour la persistance de l'état
import { createJSONStorage, persist } from 'zustand/middleware';

//Définition de l'interface pour le state du store
interface ProductsState {
    products: Product[];                            //Liste complète des produits
    filteredProducts: Product[];                    //Liste des produits filtrés   
    categories: string[];                           //Liste des catégories de produits disponibles
    loading: boolean;                               //Indicateur de chargement
    error: string | null;   
    selectedCategory: string | null;                        //Message d'erreur, s'il y en a
//Action to fetch products
    //Méthode pour récupérer les produoits depuis l'API
    fetchProducts: () => Promise<void>;
    //Méthode pour récupérer les catégories depuis l'API
    fetchCategories: () => Promise<void>;
    setCategory: (category: string | null) => Promise<void>;
    searchProducts: (query: string) => void;
    sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;
    searchProductsRealTime: (query: string) => Promise<void>;
}
//Création du store avec Zustand et persistance avec AsyncStorage
export const useProductStore = create<ProductsState>((set, get) =>
  ({
    //Initialisation des valeurs du state
    products: [],
    filteredProducts: [],
    selectedCategory: null,
    categories: [],
    loading: false,
    error: null,
    //Méthode pour récupérer les produits depuis l'API
    fetchProducts: async () => {
      try {
        //Active le mode de chargement et réinitialise les erreurs
        set({ loading: true, error: null });
        //Appel de l'API pour récupérer les produits
        const products = await getProducts();
        //Mise à jour du state (donc le store) avec les produits récupérés
        set({ 
          products,                           //Liste complète des produits
          filteredProducts: products,         //Initialement, les produits filtrés sont les mêmes que la liste complète
          loading: false                      //Désactive le mode de chargement
        });
      } catch (error: any) {
        //Enregistre l'erreur et stoppe le chargement
        set({ error: error.message, loading: false });
      }
    },
    fetchCategories: async () => {
      try {
        set({loading: true, error: null });
        const categories = await getCategories();
        set({ categories, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },
    setCategory: async (category: string | null) => {
      // try {
      //   set({ selectedCategory: category, loading: true, error: null});

      //   if ( category) {
      //     set ({ loading: true, error: null });
      //     const products = await getProductsByCategory(category);
      //     set ({ filteredProducts: products, loading: false});
      //   } else {
      //     set({ filteredProducts: get().products, loading: false});
      //   }
      // } catch (error: any) {
      //   set({ error: error.message, loading: false}); 
      // }
    },
    searchProducts: (query: string) => {
      // const searchTerm = query.toLowerCase().trim();
      // const { products, selectedCategory } = get();

      // let filtered = products;
      // if (selectedCategory) {
      //   filtered = products.filter(
      //     (product) => product.category === selectedCategory
      //   );
      // }
      // if (searchTerm) {
      //   filtered = filtered.filter(
      //     (product) => 
      //       product.title.toLowerCase().includes(searchTerm) ||
      //       product.description.toLowerCase().includes(searchTerm) ||
      //       product.category.toLowerCase().includes(searchTerm)
      //   );
      // }
      // set({ filteredProducts: filtered });
    },
    sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => {
      // const { filteredProducts }= get();
      // let sorted = [...filteredProducts];

      // switch (sortBy) {
      //   case "price-asc":
      //     sorted.sort((a, b) => a.price - b.price);
      //   break;
      //   case "price-desc":
      //     sorted.sort((a, b) => b.price - a.price);
      //   break;
      //   case "rating":
      //     sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      //   break;
      //   default:
      //   break;
      // }
      // set({ filteredProducts: sorted});
    },
    searchProductsRealTime: async (query: string) => {
      // try {
      //   set({ loading: true, error: null});

      //   // if (!query.trim()) {
      //   //     set ({ filteredProducts: get().products, loading: false });
      //   //     return;
      //   // }

      //   if(query?.length >= 3 ) { //modif ici aussi
      //     const searchResults = await searchProductsApi(query);
      //     set({ filteredProducts: searchResults, loading: false});
      //   } else {
      //     set({ filteredProducts: [], loading: false });
      //   }
      // } catch (error: any) {
      //   set({ error: error.message, loading: false});
      // }
    },
  })
);