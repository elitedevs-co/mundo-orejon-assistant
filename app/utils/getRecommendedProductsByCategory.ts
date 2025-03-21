import { getCategoryId, getProducts } from "./shared";

export const getRecommendedProductsByCategory = async (category: string) => {
  try {
    const categoryId = await getCategoryId(category);

    if (!categoryId) {
      return [];
    }

    const products = await getProducts({ categoryId, featured: true });

    return products;
  } catch (error) {
    console.error("Error getting products for category:", error);

    return [];
  }
};