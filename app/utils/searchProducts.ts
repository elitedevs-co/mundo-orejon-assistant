import { getCategoryId, getProducts } from "./shared";

export const searchProducts = async (name: string, category: string) => {
  const categoryId = await getCategoryId(category);

  if (!categoryId) {
    return [];
  }

  const products = await getProducts({ name, categoryId });

  return products;
};