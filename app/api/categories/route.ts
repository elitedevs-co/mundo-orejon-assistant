import { NextResponse } from 'next/server';
import { getCategoryId } from '../utils/woocommerce';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    if (!search) {
      return NextResponse.json(
        { error: 'Search parameter is required' }, 
        { status: 400 }
      );
    }
    
    const categoryId = await getCategoryId(search);
    
    return NextResponse.json(categoryId);
  } catch (error) {
    console.error("Error in categories API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" }, 
      { status: 500 }
    );
  }
}
