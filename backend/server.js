const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('public/uploads'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superlatino')
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a Super Latino Store API',
    version: '1.0.0',
    status: 'active'
  });
});

// Importar rutas
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const serviceRoutes = require('./routes/services');
const serviceCategoryRoutes = require('./routes/service-categories');
const orderRoutes = require('./routes/orders');
const departmentRoutes = require('./routes/departments');
const uploadRoutes = require('./routes/upload');
const statsRoutes = require('./routes/stats');
const { router: authRoutes, authenticateToken, requireAdmin } = require('./routes/auth');

// Permitir lectura pública para storefront y proteger escrituras para admin
const protectAdminWrites = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  return authenticateToken(req, res, () => requireAdmin(req, res, next));
};

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', protectAdminWrites, productRoutes);
app.use('/api/categories', protectAdminWrites, categoryRoutes);
app.use('/api/services', protectAdminWrites, serviceRoutes);
app.use('/api/service-categories', protectAdminWrites, serviceCategoryRoutes);
app.use('/api/departments', protectAdminWrites, departmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', authenticateToken, requireAdmin, uploadRoutes);
app.use('/api/stats', authenticateToken, requireAdmin, statsRoutes);

// Manejo de errores
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Ruta no encontrada
app.use(notFound);

// Error handler global
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;


