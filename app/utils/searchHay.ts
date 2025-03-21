import { getProducts } from "./shared";

export const searchHay = async () => {
  const products = await getProducts({ tag: '107' });
  return products;
};
