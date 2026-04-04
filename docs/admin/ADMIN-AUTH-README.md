# Super Latino Store - Panel de Administración con Autenticación

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
# Backend
cd backend
npm install

# Frontend (si es necesario)
cd ../frontend
npm install
```

### 2. Configurar Base de Datos
Asegúrate de tener MongoDB corriendo (local o Atlas).

### 3. Poblar Base de Datos
```bash
cd backend
npm run seed
```

Esto crea:
- Datos de ejemplo (departamentos, categorías, productos, servicios)
- **Usuario administrador**: `admin@superlatino.com` / `admin123`

### 4. Iniciar Servidores
```bash
# Backend
cd backend
npm run dev  # o node server.js

# Frontend (opcional)
cd ../frontend
npm run dev

# Abrir Admin Panel
# Abre admin/index.html en tu navegador
```

## 🔐 Autenticación

### Credenciales por Defecto
- **Email**: `admin@superlatino.com`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer login desde el panel de administración.

### Funcionalidades de Autenticación
- ✅ Login con email/contraseña
- ✅ JWT tokens con expiración de 24 horas
- ✅ Verificación automática de sesión
- ✅ Logout seguro
- ✅ Protección de todas las rutas API
- ✅ Middleware de autorización para admin

### API de Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@superlatino.com",
  "password": "admin123"
}
```

#### Verificar Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Cambiar Contraseña
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "nueva_password_segura"
}
```

## 🛡️ Seguridad

### Variables de Entorno
Crea un archivo `.env` en `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/superlatino
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=5000
NODE_ENV=production
```

### Producción
- Cambia `JWT_SECRET` por una clave segura
- Usa HTTPS
- Configura CORS apropiadamente
- Implementa rate limiting
- Usa variables de entorno para todas las configuraciones sensibles

## 📁 Estructura del Proyecto

```
super-latino-store/
├── backend/
│   ├── models/
│   │   ├── User.js          # Modelo de usuario
│   │   └── ...              # Otros modelos
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   └── ...              # Otras rutas
│   ├── server.js            # Servidor principal
│   └── .env                 # Variables de entorno
├── admin/
│   ├── index.html           # Panel admin con login
│   ├── app.js               # Lógica del panel
│   └── styles.css           # Estilos
└── frontend/                 # Tienda pública
```

## 🔧 Desarrollo

### Crear Usuario Admin Manualmente
Si necesitas crear un admin adicional:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = new User({
    username: 'nuevo_admin',
    email: 'nuevo@admin.com',
    password: 'password_seguro',
    role: 'admin'
  });
  await user.save();
  console.log('Admin creado');
  process.exit(0);
});
"
```

### Testing
Para probar las rutas protegidas:
```bash
# Obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@superlatino.com","password":"admin123"}'

# Usar token en requests
curl -H "Authorization: Bearer TU_TOKEN_AQUI" \
  http://localhost:5000/api/products
```

## 🚀 Despliegue en VPS

### Preparación
1. Instala Node.js y MongoDB en tu VPS
2. Clona el repositorio
3. Configura variables de entorno
4. Ejecuta `npm run seed` para datos iniciales
5. Configura Nginx/Apache como proxy reverso
6. Obtén certificado SSL

### Comandos de Producción
```bash
# Instalar PM2 para gestión de procesos
npm install -g pm2

# Iniciar backend
cd backend
pm2 start server.js --name "superlatino-backend"

# Iniciar frontend (si usas SSR)
cd ../frontend
npm run build
pm2 start npm --name "superlatino-frontend" -- run preview
```

### Configuración Nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:4173;  # Puerto del frontend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Authorization $http_authorization;
    }

    # Admin panel
    location /admin {
        alias /ruta/a/tu/proyecto/admin;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del backend: `pm2 logs superlatino-backend`
2. Verifica la conexión a MongoDB
3. Confirma que las variables de entorno estén configuradas
4. Revisa la consola del navegador para errores del admin panel

¡El panel de administración ahora está completamente seguro y listo para producción! 🎉