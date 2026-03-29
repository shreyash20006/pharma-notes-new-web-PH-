import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Cashfree } from 'cashfree-pg';

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

    // Initialize Cashfree
    const cf = Cashfree as any;
    cf.XClientId = appId;
    cf.XClientSecret = secretKey;
    cf.XEnvironment = env === 'PRODUCTION' ? cf.Environment?.PRODUCTION || 'PRODUCTION' : cf.Environment?.SANDBOX || 'SANDBOX';

    const { orderId } = req.query;

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const response = await cf.PGGetOrder('2023-08-01', orderId);
    console.log('Cashfree order verified:', orderId);

    if (!response.data) {
      return res.status(500).json({
        error: response.message || 'Failed to verify order',
      });
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Cashfree verification error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to verify payment';
    return res.status(500).json({ error: errorMessage });
  }
}
