const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');

router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const categories = await ServiceCategory.find(filter).sort('order name');

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

router.post('/', async (req, res) => {
  try {
    const category = new ServiceCategory(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoria de servicio creada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Categoria de servicio no encontrada'
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Categoria de servicio actualizada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Categoria de servicio no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoria de servicio eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
