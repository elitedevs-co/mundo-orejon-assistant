/**
 * Client-side function to generate a Wompi payment link via our secure API
 * @param amount The payment amount in the local currency
 * @returns The payment link URL from Wompi
 */
export const generateWompiLink = async (amount: number): Promise<string> => {
  try {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('generateWompiLink returnValue: ', data.paymentLink);
    return data.paymentLink;
  } catch (error) {
    console.error("Error generating payment link:", error);
    return '';
  }
};
