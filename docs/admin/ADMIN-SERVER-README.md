# 🔧 Servidor de Desarrollo - Admin Panel

## 📋 Información General

Se ha creado un servidor de desarrollo local (`admin-server.js`) para el panel de administración que soluciona los problemas de seguridad de archivos locales y permite un desarrollo más fluido.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```bash
# PowerShell
.\START-ALL.ps1

# O CMD
START-ALL.bat
```

### Opción 2: Manual
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (opcional)
cd ../frontend
npm run dev

# Terminal 3: Admin Panel
cd ..
node admin-server.js
```

## 🌐 URLs de Acceso

- **Admin Panel**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173 (opcional)

## 🔐 Credenciales de Admin

```
Email: admin@superlatino.com
Password: admin123
```

⚠️ **IMPORTANTE**: Cambia la contraseña inmediatamente después del primer login.

## 🛠️ ¿Por qué este servidor?

### ❌ Problemas con archivos locales:
- Error de CORS con la API
- Restricciones de seguridad del navegador
- `file://` URLs no permiten ciertas funcionalidades

### ✅ Soluciones con el servidor local:
- ✅ Sin errores de CORS
- ✅ Funcionalidad completa
- ✅ Desarrollo más rápido
- ✅ Simula entorno de producción

## 📁 Estructura

```
admin-server.js          # Servidor de desarrollo
admin/                    # Archivos del panel admin
├── index.html           # HTML principal
├── app.js              # Lógica JavaScript
└── styles.css          # Estilos CSS
```

## 🔧 Configuración

El servidor está configurado para:
- Servir archivos estáticos desde `admin/`
- Puerto 3000 (configurable)
- CORS habilitado para desarrollo
- Recarga automática de archivos

## 🚀 Para Producción

En producción, el panel admin debe servirse desde el mismo servidor que el backend API para evitar problemas de CORS. Ejemplo con Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Admin panel
    location /admin {
        alias /ruta/a/tu/proyecto/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        # ... configuración proxy
    }
}
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'express'"
```bash
npm install express
```

### Error de conexión con API
- Verifica que el backend esté corriendo en puerto 5000
- Revisa la configuración de CORS en el backend

### Problemas de login
- Ejecuta `npm run seed` en el backend para crear usuario admin
- Verifica las credenciales en la consola del navegador

## 📝 Notas de Desarrollo

- El servidor es solo para desarrollo local
- No usar en producción
- Para producción, integra el admin panel con tu servidor web principal