const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del departamento es requerido'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '🏪'
  },
  image: {
    url: String,
    alt: String
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  stats: {
    productCount: {
      type: Number,
      default: 0
    },
    categoryCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Generar slug automáticamente antes de guardar
departmentSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Department', departmentSchema);

