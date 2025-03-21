interface Product {
  id: number;
  name: string;
  price: string;
  short_description: string;
  image: string;
};

export const getCategoryId = async (categoryName: string) => {
  try {
    const params = new URLSearchParams({
      search: categoryName,
    });
    
    const response = await fetch(`/api/categories?${params.toString()}`);
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const categoryId = await response.json();
    return categoryId;
  } catch (error) {
    console.error("Error getting categoryId:", error);
    return '';
  }
}

export const getProducts = async (
  {name, categoryId, featured, tag}:
  {
    name?: string,
    categoryId?: string,
    featured?: boolean,
    tag?: string,
  }
) => {
  try {
    const params = new URLSearchParams();
    
    if (name) params.set('name', name);
    if (categoryId) params.set('category', categoryId);
    if (featured) params.set('featured', 'true');
    if (tag) params.set('tag', tag);
    
    const response = await fetch(`/api/products?${params.toString()}`);

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const products: Product[] = await response.json();
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};
