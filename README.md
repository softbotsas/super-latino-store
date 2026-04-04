# 🏪 Super Latino Store

Plataforma completa de e-commerce para la comunidad latina en Estados Unidos. Incluye tienda online, servicios esenciales y panel de administración.

## 🌟 Características Principales

### 🛍️ **Frontend (Vue.js)**
- Página de selección innovadora (Productos/Servicios)
- Diseño moderno y responsive
- Carrusel de ofertas automático
- Productos destacados con descuentos
- Departamentos visuales
- Servicios destacados para la comunidad latina
- Popup de bienvenida
- Tailwind CSS para estilos

### ⚙️ **Backend (Node.js + Express)**
- API RESTful completa
- MongoDB con Mongoose
- Endpoints para productos, categorías, departamentos y servicios
- Búsqueda y filtrado avanzado
- Paginación
- Soft delete
- CORS configurado

### 👨‍💼 **Panel de Administración**
- Dashboard con estadísticas
- Gestión completa de productos (CRUD)
- Gestión de categorías y departamentos
- Gestión de servicios
- Interfaz moderna sin dependencias
- Filtros y búsqueda en tiempo real

## 📁 Estructura del Proyecto

```
super-latino-store/
├── frontend/          # Aplicación Vue.js
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   └── assets/
│   └── public/
│
├── backend/           # API Node.js
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
│
└── admin/            # Panel de administración
    ├── index.html
    ├── styles.css
    └── app.js
```

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd super-latino-store
```

### 2. Backend Setup
```bash
cd backend
npm install
# Crear archivo .env con las configuraciones
npm run dev
```

### 3. Poblar Base de Datos
```bash
cd backend
npm run seed
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Abrir Panel Admin
Simplemente abre `admin/index.html` en tu navegador o:
```bash
cd admin
python -m http.server 8080
# Abre http://localhost:8080
```

## 📋 Requisitos Previos

- **Node.js** v16 o superior
- **MongoDB** instalado y corriendo localmente
- **npm** o **yarn**
- Navegador web moderno

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Panel Admin**: Abrir `admin/index.html` o usar servidor local

## 📦 Departamentos Disponibles

1. 🛒 **Grocery** - Comida y bebidas
2. 💊 **Pharmacy** - Salud y bienestar
3. 👕 **Clothing** - Ropa, zapatos y accesorios
4. 👶 **Baby & Kids** - Productos para bebés y niños
5. 📱 **Electronics** - Electrónicos y tecnología
6. 🏡 **Home & Garden** - Hogar, jardín y herramientas
7. 🎮 **Toys** - Juguetes y juegos al aire libre
8. 💄 **Personal Care** - Cuidado personal
9. 🐾 **Pets** - Productos para mascotas
10. ⚽ **Sports** - Deportes y actividades

## ⚡ Servicios Ofrecidos

### Financieros
- 💰 Transferencias de Dinero
- 💵 Money Orders
- 💳 Pago de Servicios
- 💵 Pago de Renta

### Telecomunicaciones
- 📱 Recargas de Celular
- 🌍 Recargas Internacionales
- 📲 Activación de Celulares
- ☎️ Recargas de Llamadas Internacionales
- 📞 Recargas Domésticas

### Otros
- 🎁 Gift Cards
- 🛡️ Servicios de Seguro
- 📺 IPTV Television
- 📢 Servicios de Publicidad
- 📱 Gestión de Redes Sociales

## 🔧 Tecnologías Utilizadas

### Frontend
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (State Management)
- Tailwind CSS 3
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS

### Admin Panel
- HTML5
- CSS3 (Variables, Grid, Flexbox)
- JavaScript ES6+ (Vanilla)

## 📖 Documentación Detallada

Cada sección del proyecto tiene su propia documentación:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Admin README](./admin/README.md)

## 🗄️ Base de Datos

### Modelos Principales

**Product**
- name, description, price, discount
- category, department (referencias)
- images, stock, sku
- featured, isActive, rating

**Category**
- name, slug, description
- department (referencia)
- image, order, isActive

**Department**
- name, slug, description
- icon, color, image
- stats, order, isActive

**Service**
- name, slug, description
- category, icon, price
- features, requirements
- featured, isActive, stats

## 🎨 Paleta de Colores

```css
--latino-blue: #3B82F6
--latino-green: #10B981
--latino-red: #EF4444
--latino-yellow: #F59E0B
```

## 🚧 Próximas Funcionalidades

### Frontend
- [ ] Catálogo completo de productos con filtros
- [ ] Página de detalle de producto
- [ ] Carrito de compras
- [ ] Checkout process
- [ ] Autenticación de usuarios
- [ ] Perfil de usuario
- [ ] Historial de órdenes

### Backend
- [ ] Autenticación JWT
- [ ] Sistema de órdenes
- [ ] Procesamiento de pagos
- [ ] Sistema de reviews
- [ ] Upload de imágenes
- [ ] Email notifications
- [ ] Analytics

### Admin
- [ ] Upload de imágenes
- [ ] Gestión de órdenes
- [ ] Analytics dashboard
- [ ] Gestión de usuarios
- [ ] Configuración de envíos
- [ ] Reportes y exportación

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
```

### Backend
```bash
npm run dev          # Servidor con nodemon
npm start            # Servidor de producción
npm run seed         # Poblar base de datos
```

## 🐛 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no está corriendo, iniciar el servicio
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Puerto ocupado
Si el puerto 5000 o 5173 está ocupado:
```bash
# Backend: Cambiar PORT en .env
# Frontend: Vite te ofrecerá automáticamente otro puerto
```

### CORS error
Verifica que la URL del frontend esté en `CORS_ORIGIN` en el archivo `.env` del backend.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👥 Equipo

**Super Latino Store Team**

## 📞 Contacto

¿Necesitas ayuda? 
- 📧 Email: support@superlatino.com
- 📱 Teléfono: 1-800-SUPER-LATINO

---

Hecho con ❤️ para la comunidad latina 🌎




