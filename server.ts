import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import {
  INITIAL_CATEGORIES,
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_PLATFORM_CONFIG,
  INITIAL_AUDIT_LOGS,
  INITIAL_REPORTS
} from "./src/data/mockData.ts";
import {
  Store,
  Product,
  Order,
  User,
  PlatformConfig,
  AuditLog,
  ReportItem,
  PaymentTransaction
} from "./src/types/index.ts";

const prisma = new PrismaClient();

// Fallback in-memory data (used for config/logs/reports not in DB)
let platformConfig: PlatformConfig = { ...INITIAL_PLATFORM_CONFIG };
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let reports: ReportItem[] = [...INITIAL_REPORTS];
let paymentTransactions: PaymentTransaction[] = [];

async function startServer() {
  const app = express();
  const DEFAULT_PORT = Number(process.env.PORT || 3000);

  const tryListen = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`[MG Gestion] Server running on http://localhost:${port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy, retrying on ${nextPort}...`);
        tryListen(nextPort);
        return;
      }

      console.error("Server startup error:", error);
      process.exit(1);
    });
  };

  app.use(express.json());

  // Authentication middleware (optional for now, just logs attempts)
  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      req.body.userId = authHeader.substring(7); // Extract user ID from token
    }
    next();
  };

  app.use(authMiddleware);

  // --- API Routes ---

  // Health check
  app.get("/api/health", async (_req, res) => {
    try {
      const usersCount = await prisma.user.count();
      const productsCount = await prisma.product.count();
      const ordersCount = await prisma.order.count();
      const storesCount = await prisma.store.count();

      res.json({
        status: "ok",
        service: "MG Gestion Core API",
        time: new Date().toISOString(),
        usersCount,
        productsCount,
        ordersCount,
        storesCount,
        database: "SQLite (Prisma)"
      });
    } catch (error) {
      res.status(500).json({ error: "Database connection failed", status: "error" });
    }
  });

  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).json({ error: "Email requis" });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

      // Generate a simple token (in production use JWT)
      const token = Buffer.from(user.id).toString('base64');
      res.json({ success: true, user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, phone, role } = req.body;
      if (!email || !name) return res.status(400).json({ error: "Email et nom requis" });

      const user = await prisma.user.create({
        data: { name, email, phone: phone || "", role: role || "BUYER" }
      });

      const token = Buffer.from(user.id).toString('base64');
      res.status(201).json({ success: true, user, token });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Cet email existe déjà" });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // Config
  app.get("/api/config", (_req, res) => {
    res.json(platformConfig);
  });

  app.put("/api/config", (req, res) => {
    platformConfig = { ...platformConfig, ...req.body };
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: req.body.adminName || 'Admin Central',
      actorRole: 'ADMIN',
      action: 'CONFIG_UPDATED',
      target: 'Platform Settings',
      details: `Paramètres mis à jour : Commission ${platformConfig.marketplaceCommissionPercent}%`,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, config: platformConfig });
  });

  // Categories
  app.get("/api/categories", (_req, res) => {
    res.json(INITIAL_CATEGORIES);
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { storeId, search } = req.query;
      const where: any = {};
      
      if (storeId) where.storeId = storeId;
      if (search && typeof search === 'string') {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: { store: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(products);
    } catch (error) {
      console.error('[API Error] /api/products:', error);
      res.status(500).json({ error: "Failed to fetch products", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: { store: true }
      });
      if (!product) return res.status(404).json({ error: "Produit non trouvé" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const { title, description, priceHtg, stock, images, storeId } = req.body;
      const product = await prisma.product.create({
        data: {
          title,
          description,
          priceHtg,
          stock: stock || 0,
          images,
          storeId,
          isActive: true
        },
        include: { store: true }
      });
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
        include: { store: true }
      });
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await prisma.product.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Stores
  app.get("/api/stores", async (req, res) => {
    try {
      const { search } = req.query;
      const where: any = {};
      
      if (search && typeof search === 'string') {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const stores = await prisma.store.findMany({
        where,
        include: { owner: true, products: true }
      });
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const store = await prisma.store.findUnique({
        where: { id: req.params.id },
        include: { owner: true, products: true }
      });
      if (!store) return res.status(404).json({ error: "Boutique non trouvée" });
      res.json(store);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch store" });
    }
  });

  app.post("/api/stores", async (req, res) => {
    try {
      const { name, description, ownerId } = req.body;
      const store = await prisma.store.create({
        data: { name, description, ownerId },
        include: { owner: true }
      });
      auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: name,
        actorRole: 'SELLER',
        action: 'STORE_REGISTERED',
        target: name,
        details: `Nouvelle boutique créée`,
        timestamp: new Date().toISOString()
      });
      res.status(201).json(store);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/stores/:id", async (req, res) => {
    try {
      const store = await prisma.store.update({
        where: { id: req.params.id },
        data: req.body,
        include: { owner: true }
      });
      res.json(store);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const { buyerId, storeId, status } = req.query;
      const where: any = {};
      
      if (buyerId) where.buyerId = buyerId;
      if (storeId) where.storeId = storeId;
      if (status) where.status = status;

      const orders = await prisma.order.findMany({
        where,
        include: { buyer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { buyer: true, items: { include: { product: true } } }
      });
      if (!order) return res.status(404).json({ error: "Commande non trouvée" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { buyerId, items, totalHtg, paymentMethod } = req.body;

      const order = await prisma.order.create({
        data: {
          buyerId,
          totalHtg,
          paymentMethod,
          status: "PENDING",
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceHtg: item.priceHtg,
            })),
          },
        },
        include: { buyer: true, items: { include: { product: true } } },
      });

      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
        include: { buyer: true, items: { include: { product: true } } }
      });
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/orders/:id/review", async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: "DELIVERED" },
        include: { buyer: true, items: { include: { product: true } } }
      });
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Payments (MonCash & NatCash Real Integration)
  
  // Initialize payment - creates transaction in PENDING state
  app.post("/api/payments/initiate", async (req, res) => {
    try {
      const { orderId, amountHTG, method, userId } = req.body;

      if (!amountHTG || amountHTG <= 0) {
        return res.status(400).json({ success: false, message: "Montant invalide" });
      }
      if (!method || !['MONCASH', 'NATCASH'].includes(method)) {
        return res.status(400).json({ success: false, message: "Méthode de paiement invalide" });
      }

      const transaction = await prisma.paymentTransaction.create({
        data: {
          orderId,
          amountHTG,
          method,
          status: 'PENDING',
          userId,
          transactionRef: `${method}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      });

      res.status(201).json({
        success: true,
        transaction,
        paymentUrl: `${process.env.APP_URL || 'http://localhost:3002'}/payment?txnId=${transaction.id}&method=${method}`
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Confirm payment via MonCash/NatCash
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { transactionId, senderPhone, confirmation } = req.body;

      if (!transactionId || !senderPhone) {
        return res.status(400).json({ success: false, message: "Données manquantes" });
      }

      const transaction = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction non trouvée" });
      }

      if (transaction.status !== 'PENDING') {
        return res.status(400).json({ success: false, message: "Transaction déjà traitée" });
      }

      // Validate with payment gateway (MonCash/NatCash API)
      // For now, we simulate successful confirmation
      const isValid = senderPhone && confirmation;

      if (!isValid) {
        const failed = await prisma.paymentTransaction.update({
          where: { id: transactionId },
          data: {
            status: 'FAILED',
            failedAt: new Date(),
            failureReason: 'Confirmation invalide'
          }
        });
        return res.status(400).json({ success: false, message: "Confirmation invalide", transaction: failed });
      }

      // Update transaction to SUCCESSFUL
      const updated = await prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'SUCCESSFUL',
          senderPhone,
          confirmedAt: new Date(),
          externalId: `${transaction.method}-API-${Math.random().toString(36).substr(2, 9)}`
        },
        include: { order: true, user: true }
      });

      // Update order status
      if (updated.orderId) {
        await prisma.order.update({
          where: { id: updated.orderId },
          data: { status: 'PAID', transactionId: updated.id }
        });
      }

      res.json({
        success: true,
        message: `Paiement de ${updated.amountHTG} HTG confirmé via ${updated.method}`,
        transaction: updated
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Check payment status
  app.get("/api/payments/:transactionId", async (req, res) => {
    try {
      const transaction = await prisma.paymentTransaction.findUnique({
        where: { id: req.params.transactionId },
        include: { order: true, user: true }
      });

      if (!transaction) {
        return res.status(404).json({ error: "Transaction non trouvée" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Get user transactions
  app.get("/api/payments/user/:userId", async (req, res) => {
    try {
      const transactions = await prisma.paymentTransaction.findMany({
        where: { userId: req.params.userId },
        include: { order: true },
        orderBy: { createdAt: 'desc' }
      });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Refund transaction
  app.post("/api/payments/:transactionId/refund", async (req, res) => {
    try {
      const { reason } = req.body;
      const transaction = await prisma.paymentTransaction.findUnique({
        where: { id: req.params.transactionId }
      });

      if (!transaction) {
        return res.status(404).json({ error: "Transaction non trouvée" });
      }

      if (transaction.status === 'REFUNDED') {
        return res.status(400).json({ error: "Transaction déjà remboursée" });
      }

      const refunded = await prisma.paymentTransaction.update({
        where: { id: req.params.transactionId },
        data: {
          status: 'REFUNDED',
          failedAt: new Date(),
          failureReason: reason || 'Remboursement demandé'
        }
      });

      res.json({ success: true, message: "Remboursement traité", transaction: refunded });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin endpoints
  app.get("/api/admin/metrics", async (_req, res) => {
    try {
      const usersCount = await prisma.user.count();
      const ordersCount = await prisma.order.count();
      const productsCount = await prisma.product.count();
      const storesCount = await prisma.store.count();

      const totalOrders = await prisma.order.aggregate({
        _sum: { totalHtg: true },
      });

      res.json({
        usersCount,
        ordersCount,
        productsCount,
        storesCount,
        totalRevenue: totalOrders._sum.totalHtg || 0,
        platformFee: (totalOrders._sum.totalHtg || 0) * 0.05,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/admin/logs", (_req, res) => {
    res.json(auditLogs);
  });

  // Users API
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, phone, role } = req.body;
      const user = await prisma.user.create({
        data: { name, email, phone, role: role || "BUYER" },
      });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { store: true, orders: true }
      });
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body,
        include: { store: true }
      });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Messages API
  app.get("/api/messages", async (req, res) => {
    try {
      const { senderId, receiverId } = req.query;
      const where: any = {};
      
      if (senderId) where.senderId = senderId;
      if (receiverId) where.receiverId = receiverId;

      const messages = await prisma.message.findMany({
        where,
        include: { sender: true, receiver: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { senderId, receiverId, content, isAutoReply } = req.body;
      const message = await prisma.message.create({
        data: { senderId, receiverId, content, isAutoReply: isAutoReply || false },
        include: { sender: true, receiver: true }
      });
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Wishlist API
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.userId },
        include: { wishlist: true }
      });
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      res.json(user.wishlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { connect: { id: productId } } },
        include: { wishlist: true }
      });
      res.json(user.wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { disconnect: { id: productId } } },
        include: { wishlist: true }
      });
      res.json(user.wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  tryListen(DEFAULT_PORT);
}

startServer();
