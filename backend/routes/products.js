const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      department, 
      featured, 
      onSale,
      salesChannel,
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt'
    } = req.query;

    // Construir filtros
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (salesChannel) {
      if (salesChannel === 'virtual') {
        filter.salesChannel = { $in: ['virtual', 'both'] };
      } else if (salesChannel === 'store') {
        filter.salesChannel = { $in: ['store', 'both'] };
      }
    }
    if (onSale === 'true') {
      filter.$or = [
        { discount: { $gt: 0 } },
        { $expr: { $gt: ['$originalPrice', '$price'] } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }
    if (req.query.maxStock !== undefined) {
      filter.stock = { $lte: Number(req.query.maxStock) };
    }
    if (req.query.minStock !== undefined) {
      filter.stock = { ...filter.stock, $gte: Number(req.query.minStock) };
    }

    // Ejecutar consulta
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('department', 'name slug icon')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description')
      .populate('department', 'name slug icon color');
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Eliminar un producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Productos destacados
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .populate('department', 'name slug icon')
      .limit(10);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Productos relacionados
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }

    // Buscar productos de la misma categoría, excluyendo el actual
    const relatedProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .populate('department', 'name slug icon')
      .limit(8)
      .lean();

    res.json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Búsqueda avanzada
router.get('/search/advanced', async (req, res) => {
  try {
    const {
      q, // Término de búsqueda
      minPrice,
      maxPrice,
      minRating,
      category,
      department,
      inStock,
      featured,
      sortBy = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Construir query
    const query = { isActive: true };

    // Búsqueda de texto
    if (q) {
      query.$text = { $search: q };
    }

    // Filtros de precio
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filtro de rating
    if (minRating) {
      query['rating.average'] = { $gte: Number(minRating) };
    }

    // Filtros de categoría y departamento
    if (category) query.category = category;
    if (department) query.department = department;

    // Filtro de stock
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Filtro de destacados
    if (featured === 'true') {
      query.featured = true;
    }

    // Ejecutar query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('department', 'name slug icon')
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;




