# Super Latino Store - Backend API

API REST para la plataforma Super Latino Store, desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- **API RESTful completa** con endpoints para productos, servicios, categorías y departamentos
- **Base de datos MongoDB** con modelos bien estructurados
- **Validación de datos** con Mongoose
- **CORS configurado** para desarrollo
- **Búsqueda y filtrado** avanzado de productos
- **Paginación** en listados
- **Soft delete** para mantener histórico

## 📋 Requisitos Previos

- Node.js v16 o superior
- MongoDB instalado y corriendo localmente
- npm o yarn

## 🛠️ Instalación

1. Navegar a la carpeta del backend:
```bash
cd super-latino-store/backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` (ya existe con configuración por defecto):
```env
MONGODB_URI=mongodb://localhost:27017/superlatino
PORT=5000
NODE_ENV=development
JWT_SECRET=super_latino_store_secret_key_2024
CORS_ORIGIN=http://localhost:5173
```

## 🎯 Iniciar el Servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 🌱 Poblar Base de Datos

Para insertar datos de prueba:
```bash
npm run seed
```

Este comando creará:
- 10 departamentos
- 6 categorías de ejemplo
- 2 productos de ejemplo
- 6 servicios

## 📡 Endpoints API

### Productos

- `GET /api/products` - Listar productos (con filtros y paginación)
  - Query params: `page`, `limit`, `category`, `department`, `featured`, `search`, `minPrice`, `maxPrice`, `sort`
- `GET /api/products/:id` - Obtener producto por ID
- `GET /api/products/featured/list` - Productos destacados
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto (soft delete)

### Categorías

- `GET /api/categories` - Listar categorías
  - Query params: `department`, `isActive`
- `GET /api/categories/:identifier` - Obtener por ID o slug
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Departamentos

- `GET /api/departments` - Listar departamentos
- `GET /api/departments/:identifier` - Obtener por ID o slug
- `POST /api/departments` - Crear departamento
- `PUT /api/departments/:id` - Actualizar departamento
- `DELETE /api/departments/:id` - Eliminar departamento

### Servicios

- `GET /api/services` - Listar servicios
  - Query params: `category`, `featured`, `isActive`
- `GET /api/services/:identifier` - Obtener por ID o slug
- `GET /api/services/featured/list` - Servicios destacados
- `POST /api/services` - Crear servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

## 📁 Estructura del Proyecto

```
backend/
├── models/           # Modelos de Mongoose
│   ├── Product.js
│   ├── Category.js
│   ├── Department.js
│   └── Service.js
├── routes/           # Rutas/Controllers
│   ├── products.js
│   ├── categories.js
│   ├── departments.js
│   └── services.js
├── scripts/          # Scripts utilitarios
│   └── seed.js
├── .env             # Variables de entorno
├── server.js        # Punto de entrada
└── package.json
```

## 🔧 Modelos de Datos

### Product
- name, description, price, discount
- category, department (referencias)
- images, stock, sku
- featured, isActive, rating
- specifications, tags

### Category
- name, slug, description
- department (referencia)
- image, isActive, order

### Department
- name, slug, description
- icon, image, color
- isActive, order, stats

### Service
- name, slug, description
- category, icon, image
- price, pricingType
- features, requirements
- featured, isActive, stats

## 🌐 CORS

El servidor está configurado para aceptar peticiones del frontend en desarrollo (`http://localhost:5173`).

## 📝 Notas

- Todos los endpoints de eliminación usan **soft delete** (isActive: false)
- Las búsquedas de texto están habilitadas en productos
- Los slugs se generan automáticamente desde los nombres
- La paginación por defecto es 20 items por página

## 🚧 Próximas Funcionalidades

- [ ] Autenticación con JWT
- [ ] Sistema de usuarios y roles
- [ ] Upload de imágenes
- [ ] Sistema de reviews
- [ ] Carrito de compras
- [ ] Procesamiento de pagos
- [ ] Notificaciones
- [ ] Analytics

## 📄 Licencia

ISC




