const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const { department, isActive } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    if (typeof isActive === 'string' && isActive.length > 0) {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate('department', 'name slug icon color')
      .sort('name');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Obtener una categoría por ID o slug
router.get('/:identifier', async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { _id: req.params.identifier },
        { slug: req.params.identifier }
      ]
    }).populate('department', 'name slug icon color');

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Categoría no encontrada' 
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Actualizar una categoría
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Categoría no encontrada' 
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Categoría no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;




