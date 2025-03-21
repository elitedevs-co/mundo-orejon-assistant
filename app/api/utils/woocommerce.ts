interface ProductVariation {
  id: number;
  description: string;
  price: string;
  attributes: {
    name: string;
    option: string;
  }[];
}

interface RawProduct {
  id: number;
  name: string;
  price: string;
  short_description: string;
  variations: number[];
  images: {
    src: string;
  }[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  short_description: string;
  image: string;
}

interface Category {
  id: number;
  parent: number;
}

/**
 * Gets variations for a specific product from WooCommerce API
 * @param productId The WooCommerce product ID
 * @returns Array of product variations
 */
export async function getProductVariations(productId: number) {
  try {
    const baseUrl = process.env.WOOCOMMERCE_BASE_API_URL;
    const consumer_key = process.env.WOOCOMMERCE_CK;
    const consumer_secret = process.env.WOOCOMMERCE_CS;
    
    const apiGetVariationsUrl = `${baseUrl}/wp-json/wc/v3/products/${productId}/variations`;
    const params = new URLSearchParams({
      consumer_key,
      consumer_secret,
    });

    const response = await fetch(`${apiGetVariationsUrl}?${params.toString()}`);

    if (!response.ok) {
      console.error(`API error for product ID ${productId}: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting product variations:", error);
    return [];
  }
}

/**
 * Gets category ID by name from WooCommerce API
 * @param categoryName The category name to search for
 * @returns The category ID as a string, or empty string if not found
 */
export async function getCategoryId(categoryName: string) {
  try {
    const baseUrl = process.env.WOOCOMMERCE_BASE_API_URL;
    const consumer_key = process.env.WOOCOMMERCE_CK;
    const consumer_secret = process.env.WOOCOMMERCE_CS;
    
    const apiSearchProductsCategoriesUrl = `${baseUrl}/wp-json/wc/v3/products/categories`;

    const params = new URLSearchParams({
      search: categoryName,
      consumer_key,
      consumer_secret,
      per_page: '50',
    });
    
    const response = await fetch(`${apiSearchProductsCategoriesUrl}?${params.toString()}`);
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const parsedCategoriesResponse: Category[] = await response.json();
    const mainCategory = parsedCategoriesResponse.find(cat => cat.parent === 0);

    if (!mainCategory) {
      return '';
    }

    return mainCategory.id.toString();

  } catch (error) {
    console.error("Error getting categoryId:", error);
    return '';
  }
}

/**
 * Gets products from WooCommerce API based on provided filters
 * @param options Filter options for products query
 * @returns Array of processed products with variations
 */
export async function getProducts({
  name,
  categoryId,
  featured,
  tag,
  orderby = 'popularity',
  perPage = '20'
}: {
  name?: string;
  categoryId?: string;
  featured?: boolean | string;
  tag?: string;
  orderby?: string;
  perPage?: string;
}) {
  try {
    const baseUrl = process.env.WOOCOMMERCE_BASE_API_URL;
    const consumer_key = process.env.WOOCOMMERCE_CK;
    const consumer_secret = process.env.WOOCOMMERCE_CS;
    
    const apiSearchProductsUrl = `${baseUrl}/wp-json/wc/v3/products`;
    const params = new URLSearchParams({
      consumer_key,
      consumer_secret,
      orderby,
      per_page: perPage,
      status: 'publish',
    });

    // Add optional parameters if provided
    if (name) params.set('search', name);
    if (categoryId) params.set('category', categoryId);
    if (featured === true || featured === 'true') params.set('featured', 'true');
    if (tag) params.set('tag', tag);

    const response = await fetch(`${apiSearchProductsUrl}?${params.toString()}`);

    if (!response.ok) {
      console.error(`API error for product search: ${response.status}`);
      return [];
    }

    const parsedProductsResponse: RawProduct[] = await response.json();
    const products: Product[] = [];

    // Process products and their variations
    for (const product of parsedProductsResponse) {
      if (product.variations.length === 0) {
        products.push({
          id: product.id,
          name: product.name,
          short_description: product.short_description,
          price: product.price,
          image: product.images[0]?.src || '',
        });
      } else {
        const variations = await getProductVariations(product.id);

        for (const variation of variations) {
          products.push({
            id: product.id,
            name: `${product.name} - ${variation.attributes.map(attr => `${attr.name}: ${attr.option}`).join(', ')}`,
            short_description: product.short_description,
            price: variation.price,
            image: product.images[0]?.src || '',
          });
        }
      }
    }

    return products;
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

// Export interface types for use in other files
export type { Product, ProductVariation, RawProduct, Category };
