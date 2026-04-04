const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET - Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const { category, featured, isActive = true } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const services = await Service.find(filter)
      .sort('order name');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Obtener un servicio por ID o slug
router.get('/:identifier', async (req, res) => {
  try {
    const service = await Service.findOne({
      $or: [
        { _id: req.params.identifier },
        { slug: req.params.identifier }
      ]
    });

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        error: 'Servicio no encontrado' 
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Crear un nuevo servicio
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      data: service,
      message: 'Servicio creado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Actualizar un servicio
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        error: 'Servicio no encontrado' 
      });
    }

    res.json({
      success: true,
      data: service,
      message: 'Servicio actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Eliminar un servicio
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        error: 'Servicio no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Servicios destacados
router.get('/featured/list', async (req, res) => {
  try {
    const services = await Service.find({ featured: true, isActive: true })
      .sort('order name')
      .limit(10);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;




