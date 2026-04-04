const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es requerido'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: '⚡'
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  pricingType: {
    type: String,
    enum: ['fixed', 'variable', 'percentage', 'free'],
    default: 'fixed'
  },
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  requirements: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  stats: {
    usageCount: {
      type: Number,
      default: 0
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
    }
  }
}, {
  timestamps: true
});

// Generar slug automáticamente antes de guardar
serviceSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);

