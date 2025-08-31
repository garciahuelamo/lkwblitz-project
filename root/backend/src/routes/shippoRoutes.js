// src/routes/shippo.routes.js
const express = require('express');
const {
  createOrder,
  listOrders,
  getOrder,
  getRates,
  buyLabel
} = require('../controllers/order.controller');

const router = express.Router();

// Obtener tarifas de envío
router.post('/rates', getRates);

// Comprar etiqueta de envío
router.post('/buy', buyLabel);

// Crear nueva orden
router.post('/orders', createOrder);

// Listar órdenes
router.get('/orders', listOrders);

// Obtener orden por ID
router.get('/orders/:id', getOrder);

module.exports = router;
