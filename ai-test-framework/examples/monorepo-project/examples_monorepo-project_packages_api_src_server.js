/**
 * API Server
 * Example Express API
 */
const express = require('express');
const Utils = require('@monorepo/shared');

class APIServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      req.id = Utils.generateId();
      next();
    });
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        requestId: req.id
      });
    });

    this.app.get('/api/products', (req, res) => {
      const products = [
        { id: 1, name: 'Product 1', price: 29.99 },
        { id: 2, name: 'Product 2', price: 49.99 }
      ];

      res.json({
        data: products.map(p => ({
          ...p,
          formattedPrice: Utils.formatCurrency(p.price)
        })),
        total: products.length
      });
    });

    this.app.post('/api/order', (req, res) => {
      const { items, total } = req.body;
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      res.json({
        orderId: Utils.generateId(),
        items,
        total: Utils.formatCurrency(total),
        status: 'pending'
      });
    });
  }

  start(port = 3000) {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`API Server running on port ${port}`);
        resolve(this.server);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(resolve);
      } else {
        resolve();
      }
    });
  }
}

module.exports = APIServer;