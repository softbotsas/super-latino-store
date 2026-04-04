const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Department = require('../models/Department');
const Service = require('../models/Service');
const { catchAsync } = require('../middleware/errorHandler');

// GET - Estadísticas del dashboard
router.get('/dashboard', catchAsync(async (req, res) => {
  // Contar totales
  const [totalProducts, totalServices, totalCategories, totalDepartments] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Service.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true })
  ]);

  // Productos destacados
  const featuredProducts = await Product.countDocuments({ featured: true, isActive: true });

  // Productos con bajo stock
  const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

  // Productos sin stock
  const outOfStockProducts = await Product.countDocuments({ stock: 0, isActive: true });

  // Valor total del inventario
  const inventoryValue = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }
  ]);

  // Productos por departamento
  const productsByDepartment = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
    { $unwind: '$department' },
    { $project: { name: '$department.name', icon: '$department.icon', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Productos más caros
  const topPricedProducts = await Product.find({ isActive: true })
    .sort('-price')
    .limit(5)
    .select('name price images')
    .lean();

  // Productos con mejor rating
  const topRatedProducts = await Product.find({ isActive: true, 'rating.count': { $gt: 0 } })
    .sort('-rating.average')
    .limit(5)
    .select('name rating images')
    .lean();

  res.json({
    success: true,
    data: {
      totals: {
        products: totalProducts,
        services: totalServices,
        categories: totalCategories,
        departments: totalDepartments,
        featuredProducts,
        lowStockProducts,
        outOfStockProducts
      },
      inventory: {
        totalValue: inventoryValue[0]?.total || 0
      },
      productsByDepartment,
      topPricedProducts,
      topRatedProducts
    }
  });
}));

// GET - Estadísticas de productos
router.get('/products', catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $facet: {
        priceStats: [
          { $match: { isActive: true } },
          { $group: {
            _id: null,
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            totalProducts: { $sum: 1 }
          }}
        ],
        stockStats: [
          { $match: { isActive: true } },
          { $group: {
            _id: null,
            totalStock: { $sum: '$stock' },
            avgStock: { $avg: '$stock' }
          }}
        ],
        ratingStats: [
          { $match: { isActive: true, 'rating.count': { $gt: 0 } } },
          { $group: {
            _id: null,
            avgRating: { $avg: '$rating.average' },
            totalReviews: { $sum: '$rating.count' }
          }}
        ]
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0]
  });
}));

module.exports = router;


