import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const appId = process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = (process.env.VITE_CASHFREE_ENV || 'SANDBOX').toUpperCase();

    if (!appId || !secretKey) {
      console.error('Missing Cashfree credentials');
      return res.status(500).json({
        error: 'Cashfree API keys not configured',
      });
    }

    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Use Cashfree REST API directly
    const apiUrl = env === 'PRODUCTION' 
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree verify error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to verify order',
      });
    }

    console.log('Cashfree order verified:', orderId);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Cashfree verification error:', error);
    const errorMessage = error.message || 'Failed to verify payment';
    return res.status(500).json({ error: errorMessage });
  }
}
