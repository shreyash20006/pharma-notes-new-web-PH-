import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import Razorpay from "razorpay";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // API routes
  app.post("/api/razorpay/order", async (req, res) => {
    try {
      const razorpay = getRazorpay();
      const { amount, currency = "INR" } = req.body;
      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
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
      const key_secret = process.env.RAZORPAY_KEY_SECRET;

      if (!key_secret) {
        throw new Error("Razorpay key secret is missing");
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Razorpay verification error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to verify Razorpay payment" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
