import { NextResponse } from 'next/server';
import { makePayment } from '../utils/wompi';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' }, 
        { status: 400 }
      );
    }
    
    const paymentLink = await makePayment(amount);
    
    if (!paymentLink) {
      return NextResponse.json(
        { error: 'Failed to generate payment link' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ paymentLink });
  } catch (error) {
    console.error("Error in payment API route:", error);
    return NextResponse.json(
      { error: "Failed to process payment request" }, 
      { status: 500 }
    );
  }
}
