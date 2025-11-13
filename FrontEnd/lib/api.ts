import { Product } from "@/type";

const API_URL = "https://fakestoreapi.com";

//All products
const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching products:', error);
    throw error;
  }
};

// Single Product
export const getProduct = async (id:number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product with id ${id}:', error);
    throw error;
  }
};

//All Categories
const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching products:', error);
    throw error;
  }
};
const getProductsByCategory = async ( category: string ): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch products in category ${category}:`, error);
    throw error;
  }
};
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
    console.error("Failed to search  products:", error);
    throw error;
  }
};


export { getProducts, getCategories, getProductsByCategory, searchProductsApi };