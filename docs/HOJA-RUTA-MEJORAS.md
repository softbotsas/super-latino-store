# 🚀 HOJA DE RUTA DE MEJORAS - SUPER LATINO STORE

**Fecha**: 23 de Marzo de 2026  
**Versión Actual**: 2.0.0  
**Próxima Versión Target**: 3.0.0 (Enterprise-Ready)

---

## 📋 TABLA DE PRIORIDADES

| Prioridad | Tarea | Impacto | Esfuerzo | Estimado |
|-----------|-------|--------|----------|----------|
| 🔴 CRÍTICO | JWT Auth + Roles | ALTO | 3 días | P0 |
| 🔴 CRÍTICO | Rate Limiting | ALTO | 1 día | P0 |
| 🔴 CRÍTICO | CORS Restringido | ALTO | 2h | P0 |
| 🟠 IMPORTANTE | Tests Automatizados | ALTO | 5 días | P1 |
| 🟠 IMPORTANTE | Error Tracking | MEDIO | 2 días | P1 |
| 🟠 IMPORTANTE | Logging | MEDIO | 2 días | P1 |
| 🟡 MEJORABLE | Stripe Integration | ALTO | 4 días | P2 |
| 🟡 MEJORABLE | Email Notifications | MEDIO | 3 días | P2 |
| 🟡 MEJORABLE | Caching (Redis) | MEDIO | 2 días | P2 |
| 🟡 MEJORABLE | User Profiles | MEDIO | 3 días | P2 |

---

## 🔐 SEGURIDAD (CRÍTICO - SEMANA 1)

### 1️⃣ Autenticación JWT (1.5 días)

**Archivos a crear/modificar:**
```
backend/
├── middleware/auth.js (NUEVO)
├── routes/auth.js (NUEVO)
├── models/User.js (NUEVO)
└── server.js (MODIFICAR)

frontend/
├── stores/auth.js (NUEVO)
├── composables/useAuth.js (NUEVO)
├── views/LoginView.vue (NUEVO)
└── router/index.js (MODIFICAR)
```

**Pasos de implementación:**

```javascript
// Paso 1: Instalar dependencias
npm install jsonwebtoken bcryptjs

// Paso 2: Crear modelo User (backend/models/User.js)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Paso 3: Crear rutas de auth (backend/routes/auth.js)
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Paso 4: Crear middleware de verificación (backend/middleware/auth.js)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Paso 5: Proteger rutas
router.post('/products', verifyToken, requireRole('admin'), createProduct);
```

**Testing:**
```bash
# Registrarse
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Usar token
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2️⃣ Roles y Permisos (1 día)

**Middleware de autorización:**

```javascript
// backend/middleware/authorize.js
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};

// Uso en rutas:
router.post('/products', verifyToken, authorize('admin'), createProduct);
router.put('/products/:id', verifyToken, authorize('admin'), updateProduct);
router.delete('/products/:id', verifyToken, authorize('admin'), deleteProduct);
router.get('/admin/dashboard', verifyToken, authorize('admin'), getDashboard);
```

**Roles definidos:**
```javascript
{
  'admin': {
    permissions: ['create:product', 'read:product', 'update:product', 'delete:product'],
    features: ['dashboard', 'analytics', 'settings']
  },
  'user': {
    permissions: ['read:product', 'create:order'],
    features: ['products', 'cart', 'orders']
  },
  'guest': {
    permissions: ['read:product'],
    features: ['products']
  }
}
```

---

### 3️⃣ Rate Limiting (0.5 días)

```bash
npm install express-rate-limit
```

```javascript
// backend/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                    // máximo 100 requests
  message: 'Demasiadas peticiones, intenta después'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hora
  max: 5,                      // máximo 5 intentos de login
  skipSuccessfulRequests: true // no contar intentos exitosos
});

// Aplicar en rutas
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
```

---

### 4️⃣ CORS Restringido (0.5 días)

```javascript
// Antes (inseguro):
app.use(cors());

// Después (seguro):
const allowedOrigins = [
  'http://localhost:5173',      // Frontend dev
  'http://localhost:8080',      // Admin dev
  'https://superlatino.com',    // Producción
  'https://www.superlatino.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true,             // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🧪 TESTING (IMPORTANTE - SEMANA 2)

### 1️⃣ Tests Unitarios Backend (2 días)

```bash
npm install --save-dev jest supertest
```

**Estructura:**
```
backend/
├── __tests__/
│   ├── products.test.js
│   ├── categories.test.js
│   ├── auth.test.js
│   └── middleware.test.js
```

**Ejemplo de test:**
```javascript
// backend/__tests__/products.test.js
const request = require('supertest');
const app = require('../server');
const Product = require('../models/Product');

describe('GET /api/products', () => {
  beforeAll(async () => {
    // Setup: conectar BD de test
  });

  afterAll(async () => {
    // Cleanup: desconectar BD
  });

  test('should return all active products', async () => {
    const res = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  test('should filter by category', async () => {
    const res = await request(app)
      .get('/api/products?category=electronics')
      .expect(200);

    expect(res.body.data.every(p => p.category._id === 'electronics')).toBe(true);
  });

  test('should return 404 for non-existent product', async () => {
    await request(app)
      .get('/api/products/invalid-id')
      .expect(404);
  });
});
```

### 2️⃣ Tests de Componentes Frontend (2 días)

```bash
# Ya configurado con Vitest
npm run test:unit
```

```javascript
// frontend/src/__tests__/components/ProductCard.spec.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard.vue';

describe('ProductCard.vue', () => {
  const mockProduct = {
    _id: '1',
    name: 'iPhone 15',
    price: 999,
    originalPrice: 1099,
    stock: 10,
    rating: { average: 4.5, count: 100 }
  };

  it('renders product name', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    expect(wrapper.text()).toContain('iPhone 15');
  });

  it('calculates discount correctly', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });
    expect(wrapper.vm.hasDiscount).toBe(true);
  });

  it('shows out of stock badge when stock is 0', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: { ...mockProduct, stock: 0 }
      }
    });
    expect(wrapper.text()).toContain('Agotado');
  });
});
```

### 3️⃣ Tests E2E (1.5 días)

```bash
npm install --save-dev playwright
```

```javascript
// e2e/checkout.spec.js
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete purchase successfully', async ({ page }) => {
    // 1. Ir a home
    await page.goto('http://localhost:5173');

    // 2. Ir a productos
    await page.click('button:has-text("Explorar Productos")');
    await page.waitForURL('**/catalogo');

    // 3. Agregar producto al carrito
    await page.click('button:has-text("Agregar al Carrito")');
    await expect(page.locator('text=Agregado al carrito')).toBeVisible();

    // 4. Ir al checkout
    await page.click('button:has-text("Ir al Checkout")');

    // 5. Completar formulario
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="address"]', '123 Main St');

    // 6. Completar compra
    await page.click('button:has-text("Completar Compra")');

    // 7. Verificar confirmación
    await expect(page.locator('text=Pedido completado')).toBeVisible();
  });
});
```

---

## 📊 MONITOREO Y LOGGING (IMPORTANTE - SEMANA 2)

### 1️⃣ Winston Logger (1 día)

```bash
npm install winston
```

```javascript
// backend/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'superlatino-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Uso en rutas:**
```javascript
const logger = require('../logger');

router.post('/products', async (req, res) => {
  logger.info('Creating product', { data: req.body });
  try {
    const product = await Product.create(req.body);
    logger.info('Product created', { productId: product._id });
    res.json(product);
  } catch (error) {
    logger.error('Error creating product', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});
```

### 2️⃣ Sentry Error Tracking (1.5 días)

```bash
npm install @sentry/node
```

```javascript
// backend/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());

// Después de tus rutas:
app.use(Sentry.Handlers.errorHandler());
```

---

## 💳 PROCESAMIENTO DE PAGOS (P2 - SEMANA 3)

### Stripe Integration

```bash
npm install stripe
```

```javascript
// backend/routes/payments.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, cartItems } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,  // Stripe usa centavos
      currency: 'usd',
      metadata: {
        items: JSON.stringify(cartItems)
      }
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      // Crear orden en BD
      const paymentIntent = event.data.object;
      // ...
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`);
  }
});
```

---

## 📧 NOTIFICACIONES POR EMAIL (P2 - SEMANA 3)

```bash
npm install nodemailer
```

```javascript
// backend/services/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

async function sendOrderConfirmation(email, order) {
  await transporter.sendMail({
    from: 'noreply@superlatino.com',
    to: email,
    subject: `Pedido confirmado #${order._id}`,
    html: `
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu pedido ha sido confirmado.</p>
      <p>Total: $${order.total}</p>
      <p>Seguimiento: ${order.trackingUrl}</p>
    `
  });
}

module.exports = { sendOrderConfirmation };
```

---

## ⚡ CACHING CON REDIS (P2 - SEMANA 3)

```bash
npm install redis
```

```javascript
// backend/cache.js
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

async function getOrSetCache(key, callback, ttl = 3600) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const data = await callback();
  await client.setEx(key, ttl, JSON.stringify(data));
  return data;
}

// Uso:
router.get('/products', async (req, res) => {
  const products = await getOrSetCache(
    `products:page:${req.query.page}`,
    () => Product.find().lean(),
    3600  // 1 hora
  );
  res.json(products);
});

// Invalidar cache cuando se crea un producto:
router.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  await client.del('products:*');  // Invalidar todo el caché
  res.json(product);
});
```

---

## 👤 PERFILES DE USUARIO (P2 - SEMANA 4)

```javascript
// frontend/views/ProfileView.vue
<template>
  <div class="profile">
    <div class="profile-card">
      <img :src="user.avatar" class="avatar" />
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
      
      <nav class="profile-nav">
        <button @click="currentTab = 'account'" :class="{ active: currentTab === 'account' }">
          👤 Cuenta
        </button>
        <button @click="currentTab = 'orders'" :class="{ active: currentTab === 'orders' }">
          📦 Órdenes
        </button>
        <button @click="currentTab = 'addresses'" :class="{ active: currentTab === 'addresses' }">
          📍 Direcciones
        </button>
      </nav>

      <div v-if="currentTab === 'account'" class="tab-content">
        <!-- Editar información -->
      </div>
      <div v-else-if="currentTab === 'orders'" class="tab-content">
        <!-- Historial de órdenes -->
      </div>
      <div v-else-if="currentTab === 'addresses'" class="tab-content">
        <!-- Guardar direcciones -->
      </div>
    </div>
  </div>
</template>
```

---

## 📱 PWA (Progressive Web App)

```bash
npm install -D vite-plugin-pwa
```

```javascript
// frontend/vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Super Latino Store',
        short_name: 'SLS',
        description: 'Tu tienda online favorita',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
}
```

**Beneficios:**
- ✅ Funciona offline
- ✅ Instalable como app
- ✅ Más rápido (caché)
- ✅ Push notifications

---

## 🐳 DOCKER Y DEPLOYMENT

### Dockerfile

```dockerfile
# Backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/superlatino
      NODE_ENV: production
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "80:80"

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: superlatino

volumes:
  mongo-data:
```

**Desplegar:**
```bash
docker-compose up -d
```

---

## 📊 ROADMAP VISUAL

```
MARZO 2026
├─ Semana 1: JWT + Auth + Security
├─ Semana 2: Testing + Logging
└─ Semana 3-4: Pagos + Email

ABRIL 2026
├─ Semana 1-2: User Profiles
├─ Semana 3-4: PWA + Offline
└─ Optimizaciones

MAYO 2026
├─ Docker + CI/CD
├─ Load Testing
└─ Producción

v3.0.0 ✅ LISTA
```

---

## ✅ CHECKLIST FINAL

```
ANTES DE PRODUCCIÓN:
  [ ] JWT implementado y testeado
  [ ] Rate limiting activo
  [ ] CORS restringido
  [ ] 80%+ cobertura de tests
  [ ] Logging y monitoring
  [ ] Error tracking (Sentry)
  [ ] Backups automáticos
  [ ] SSL/TLS certificado
  [ ] CDN configurado
  [ ] Performance < 2s load time
  [ ] Documentación API (Swagger)
  [ ] Disaster recovery plan
```

---

**Documento de mejoras continuadas**  
**Actualizado**: 23 de Marzo de 2026
