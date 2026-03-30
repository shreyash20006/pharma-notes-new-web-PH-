import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Cashfree } from "cashfree-pg";
import dotenv from "dotenv";

// Load environment variables immediately
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Razorpay lazy initialization helper
  const getRazorpay = () => {
    const key_id = process.env.VITE_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("Razorpay API keys are missing. Please set VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.");
    }

    return new Razorpay({
      key_id,
      key_secret,
    });
  };

  // Cashfree lazy initialization helper
  const initCashfree = () => {
    const appId = process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = (process.env.VITE_CASHFREE_ENV || "SANDBOX").toUpperCase();

    if (!appId || !secretKey) {
      throw new Error("Cashfree API keys are missing. Please set VITE_CASHFREE_APP_ID and CASHFREE_SECRET_KEY in environment variables.");
    }

    console.log(`Initializing Cashfree Server SDK in ${env} mode`);

    if (!Cashfree) {
      throw new Error("Cashfree SDK failed to load. Please check your dependencies.");
    }

    const cf = Cashfree as any;
    cf.XClientId = appId;
    cf.XClientSecret = secretKey;
    
    // Defensive check for Environment object to avoid "undefined" errors
    if (cf.Environment) {
      cf.XEnvironment = env === "PRODUCTION" ? cf.Environment.PRODUCTION : cf.Environment.SANDBOX;
    } else {
      // Fallback to string values if Environment enum is not found on the object
      cf.XEnvironment = env === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
    }
  };

  // API routes
  app.post("/api/razorpay/order", async (req, res) => {
    try {
      const razorpay = getRazorpay();
      const { amount = 499, currency = "INR" } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created:", order.id);
      
      // Return only necessary fields for frontend
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });
    } catch (error) {
      console.error("Razorpay order error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to create Razorpay order" 
      });
    }
  });

  app.post("/api/razorpay/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required payment verification fields" 
        });
      }

      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      if (!key_secret) {
        console.error("RAZORPAY_KEY_SECRET is not set");
        return res.status(500).json({ 
          success: false, 
          error: "Server configuration error" 
        });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        console.log("Payment verified successfully:", razorpay_payment_id);
        res.json({ success: true });
      } else {
        console.warn("Invalid payment signature for order:", razorpay_order_id);
        res.status(400).json({ 
          success: false, 
          error: "Invalid payment signature" 
        });
      }
    } catch (error) {
      console.error("Razorpay verification error:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment" 
      });
    }
  });

  // Cashfree routes
  app.post("/api/cashfree/order", async (req, res) => {
    try {
      initCashfree();
      const { amount, customerId, customerPhone, customerEmail, orderId } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const request = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId || `order_${Date.now()}`,
        customer_details: {
          customer_id: customerId,
          customer_phone: customerPhone || "9999999999",
          customer_email: customerEmail,
        },
        order_meta: {
          return_url: `${req.headers.origin || "http://localhost:3000"}/dashboard?order_id={order_id}`,
        },
      };

      const response = await (Cashfree as any).PGCreateOrder("2023-08-01", request);
      console.log("Cashfree order created:", response.data?.order_id);
      
      if (!response.data) {
        return res.status(500).json({ 
          error: response.message || "Failed to create Cashfree order" 
        });
      }

      res.json(response.data);
    } catch (error: any) {
      console.error("Cashfree order error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create Cashfree order";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/cashfree/verify/:orderId", async (req, res) => {
    try {
      initCashfree();
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const response = await (Cashfree as any).PGGetOrder("2023-08-01", orderId);
      console.log("Cashfree order verified:", orderId);
      
      if (!response.data) {
        return res.status(500).json({ 
          error: response.message || "Failed to verify order" 
        });
      }

      res.json(response.data);
    } catch (error: any) {
      console.error("Cashfree verification error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to verify payment";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await fs.readFile(path.resolve(process.cwd(), "index.html"), "utf-8");
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
