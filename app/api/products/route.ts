import { NextResponse } from 'next/server';
import { getProducts } from '../utils/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const categoryId = searchParams.get('category');
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    const orderby = searchParams.get('orderby') || 'popularity';
    const perPage = searchParams.get('per_page') || '20';
    
    const products = await getProducts({
      name,
      categoryId,
      featured: featured === 'true',
      tag,
      orderby,
      perPage
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    );
  }
}
