const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Crear directorios si no existen
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configurar almacenamiento de archivos organizado por carpetas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';

    // Determinar carpeta según el tipo de entidad
    if (req.body.entityType) {
      uploadPath += req.body.entityType + '/';
    } else {
      // Intentar determinar por el campo del formulario
      if (req.body.categoryId || req.body.category) {
        uploadPath += 'categories/';
      } else if (req.body.productId || req.body.product) {
        uploadPath += 'products/';
      } else if (req.body.departmentId || req.body.department) {
        uploadPath += 'departments/';
      } else {
        uploadPath += 'general/';
      }
    }

    // Crear directorio si no existe
    createDirIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

// POST - Subir imagen
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se subió ningún archivo'
      });
    }

    // URL relativa para acceder desde el frontend, respetando subcarpetas
    const relativePath = path.relative('public/uploads', req.file.path).replace(/\\/g, '/');
    const imageUrl = `/uploads/${relativePath}`;

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: 'Imagen subida exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Subir múltiples imágenes
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No se subieron archivos'
      });
    }

    const images = req.files.map(file => ({
      url: `/uploads/${path.relative('public/uploads', file.path).replace(/\\/g, '/')}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      data: images,
      message: `${images.length} imagen(es) subida(s) exitosamente`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;





