const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{6}$/
  },
  customer: {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    }
  },
  paymentMethod: {
    type: String,
    enum: ['pickup-store'],
    default: 'pickup-store'
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'El pedido debe tener al menos un producto'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['nuevo', 'en-proceso', 'listo', 'entregado', 'cancelado'],
    default: 'nuevo'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
