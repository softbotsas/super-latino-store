const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// GET - Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    // Si isActive está definido y no es vacío, aplicar filtro
    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }
    // Si no se especifica, por defecto mostrar solo activos (para frontend)
    // Pero si se pasa isActive='', mostrar todos (para admin)

    const departments = await Department.find(filter)
      .sort('name');

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Obtener un departamento por ID o slug
router.get('/:identifier', async (req, res) => {
  try {
    const department = await Department.findOne({
      $or: [
        { _id: req.params.identifier },
        { slug: req.params.identifier }
      ]
    });

    if (!department) {
      return res.status(404).json({ 
        success: false, 
        error: 'Departamento no encontrado' 
      });
    }

    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Crear un nuevo departamento
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    res.status(201).json({
      success: true,
      data: department,
      message: 'Departamento creado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Actualizar un departamento
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ 
        success: false, 
        error: 'Departamento no encontrado' 
      });
    }

    res.json({
      success: true,
      data: department,
      message: 'Departamento actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Eliminar un departamento
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ 
        success: false, 
        error: 'Departamento no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;




