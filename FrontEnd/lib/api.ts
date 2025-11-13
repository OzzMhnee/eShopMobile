import { Product } from "@/type";

const API_URL = "https://fakestoreapi.com";

//#region Tous les Produits
const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log(`Error while retrieving the list of products from the API`, error);
    throw error;
  }
};
//#endregion 

//#region un seul produit 
export const getProduct = async (id:number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error while retrieving the product with id ${id} from the API`, error);
    throw error;
  }
};
//#endregion 

//#region toutes les catégories
const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log(`Error while retrieving the list of categories from the API`, error);
    throw error;
  }
};
//#endregion 

//#region liste de produits par catégories
const getProductsByCategory = async ( category: string ): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch the list of products in category ${category}:`, error);
    throw error;
  }
};
//#endregion 

//#region résultat de recherche par mot clef, liste de produits
const searchProductsApi = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch (`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    const searchTerm = query.toLowerCase().trim();
    return products.filter(
      (product :Product) => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Failed to search products:", error);
    throw error;
  }
};
//#endregion 

export { getProducts, getCategories, getProductsByCategory, searchProductsApi };