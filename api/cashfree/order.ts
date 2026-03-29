import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const appId = process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = (process.env.VITE_CASHFREE_ENV || 'SANDBOX').toUpperCase();

    if (!appId || !secretKey) {
      console.error('Missing Cashfree credentials:', { appId: !!appId, secretKey: !!secretKey });
      return res.status(500).json({
        error: 'Cashfree API keys not configured',
      });
    }

    const { amount, customerId, customerPhone, customerEmail, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const origin = req.headers.origin || req.headers.referer || 'https://www.notesdrive.shop';

    const orderRequest = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId || `order_${Date.now()}`,
      customer_details: {
        customer_id: customerId || `cust_${Date.now()}`,
        customer_phone: customerPhone || '9999999999',
        customer_email: customerEmail || 'customer@example.com',
      },
      order_meta: {
        return_url: `${origin}/dashboard?order_id={order_id}`,
      },
    };

    // Use Cashfree REST API directly
    const apiUrl = env === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to create Cashfree order',
      });
    }

    console.log('Cashfree order created:', data.order_id);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Cashfree order error:', error);
    const errorMessage = error.message || 'Failed to create Cashfree order';
    return res.status(500).json({ error: errorMessage });
  }
}
