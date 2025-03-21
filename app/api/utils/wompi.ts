interface CreateWompiLinkResponse {
  data: {
    id: string;
  };
}

/**
 * Creates a payment link using the Wompi API
 * @param amount The payment amount in the local currency
 * @returns The payment link URL
 */
export async function makePayment(amount: number): Promise<string> {
  try {
    const url = `${process.env.WOMPI_BASE_API_URL}/payment_links`;
    const secretKey = process.env.WOMPI_PRIVATE_KEY;
    const amountInCents = amount * 100;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        name: "Pago de orden de productos en Mundo Orejón",
        description: "Pago de orden de productos en Mundo Orejón",
        single_use: true,
        collect_shipping: false,
        currency: "COP",
        amount_in_cents: amountInCents,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    const parsedResponse: CreateWompiLinkResponse = await response.json();
    return `https://checkout.wompi.co/l/${parsedResponse.data.id}`;
    
  } catch (error) {
    console.error("Error creating payment link:", error);
    return '';
  }
}
