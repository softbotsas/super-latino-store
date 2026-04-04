const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  originalPrice: {
    type: Number,
    default: null
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'El departamento es requerido']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  productType: {
    type: String,
    enum: ['general', 'alimentos', 'golosinas', 'ropa', 'zapatos'],
    default: 'general'
  },
  salesChannel: {
    type: String,
    enum: ['store', 'virtual', 'both'],
    default: 'store'
  },
  availableSizes: [{
    label: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [String]
}, {
  timestamps: true
});

// Índices para búsqueda y filtrado
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, department: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);




