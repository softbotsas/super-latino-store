const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('./auth');

const router = express.Router();

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function generateOrderNumber() {
  for (let i = 0; i < 20; i += 1) {
    const value = Math.floor(100000 + Math.random() * 900000).toString();
    const exists = await Order.exists({ orderNumber: value });
    if (!exists) return value;
  }

  throw new Error('No se pudo generar numero de pedido unico');
}

router.post('/', async (req, res) => {
  try {
    const { customer, items, notes } = req.body || {};

    if (!customer || !customer.fullName || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Los datos del cliente son obligatorios'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debes incluir al menos un producto en el pedido'
      });
    }

    const productIds = items.map((item) => item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const orderItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity || 0);
      const product = productMap.get(String(item.productId));

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Uno o mas productos no son validos'
        });
      }

      if (product.salesChannel === 'virtual') {
        return res.status(400).json({
          success: false,
          message: `El producto ${product.name} solo se compra por tienda virtual`
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Cantidad invalida para ${product.name}`
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}`
        });
      }

      const price = roundCurrency(Number(product.price || 0));
      const subtotal = roundCurrency(price * quantity);

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity,
        subtotal
      });
    }

    const subtotal = roundCurrency(orderItems.reduce((acc, item) => acc + item.subtotal, 0));
    const tax = roundCurrency(subtotal * 0.08);
    const total = roundCurrency(subtotal + tax);

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      },
      paymentMethod: 'pickup-store',
      items: orderItems,
      subtotal,
      tax,
      total,
      notes: notes || ''
    });

    const stockOperations = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } }
      }
    }));

    if (stockOperations.length > 0) {
      await Product.bulkWrite(stockOperations);
    }

    return res.status(201).json({
      success: true,
      message: 'Pedido registrado exitosamente',
      data: {
        id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        customer: order.customer,
        paymentMethod: order.paymentMethod,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        notes: order.notes
      }
    });
  } catch (error) {
    console.error('Error creando pedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el pedido'
    });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, q = '' } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'customer.fullName': { $regex: q, $options: 'i' } },
        { 'customer.email': { $regex: q, $options: 'i' } },
        { 'customer.phone': { $regex: q, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error listando pedidos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al listar pedidos'
    });
  }
});

router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body || {};
    const validStatuses = ['nuevo', 'en-proceso', 'listo', 'entregado', 'cancelado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de pedido invalido'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Estado actualizado',
      data: order
    });
  } catch (error) {
    console.error('Error actualizando estado de pedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar pedido'
    });
  }
});

module.exports = router;
