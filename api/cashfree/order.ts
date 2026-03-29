import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Cashfree } from 'cashfree-pg';

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
      console.error('Missing Cashfree credentials');
      return res.status(500).json({
        error: 'Cashfree API keys not configured',
      });
    }

    // Initialize Cashfree
    const cf = Cashfree as any;
    cf.XClientId = appId;
    cf.XClientSecret = secretKey;
    cf.XEnvironment = env === 'PRODUCTION' ? cf.Environment?.PRODUCTION || 'PRODUCTION' : cf.Environment?.SANDBOX || 'SANDBOX';

    const { amount, customerId, customerPhone, customerEmail, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const origin = req.headers.origin || req.headers.referer || 'https://notesdrive.vercel.app';

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId || `order_${Date.now()}`,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone || '9999999999',
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: `${origin}/dashboard?order_id={order_id}`,
      },
    };

    const response = await cf.PGCreateOrder('2023-08-01', request);
    console.log('Cashfree order created:', response.data?.order_id);

    if (!response.data) {
      return res.status(500).json({
        error: response.message || 'Failed to create Cashfree order',
      });
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Cashfree order error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create Cashfree order';
    return res.status(500).json({ error: errorMessage });
  }
}
