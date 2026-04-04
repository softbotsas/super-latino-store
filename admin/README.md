# Super Latino Store - Panel de Administración

Panel de administración moderno y responsive para gestionar productos, servicios, categorías y departamentos de Super Latino Store.

## 🚀 Características

- **Dashboard con estadísticas** en tiempo real
- **Gestión completa de productos** (CRUD)
- **Gestión de categorías y departamentos**
- **Gestión de servicios**
- **Interfaz moderna y responsive**
- **Filtros y búsqueda** avanzada
- **Diseño limpio** estilo SaaS
- **Sin dependencias** - HTML, CSS y JavaScript puro

## 📋 Requisitos

- Navegador web moderno
- Backend API corriendo en `http://localhost:5000`

## 🛠️ Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en tu navegador.

### Opción 1: Abrir directamente
```bash
# En Windows
start index.html

# En Mac
open index.html

# En Linux
xdg-open index.html
```

### Opción 2: Servidor local (recomendado)
```bash
# Con Python
python -m http.server 8080

# Con Node.js
npx http-server -p 8080

# Luego abre http://localhost:8080 en tu navegador
```

## 📱 Características del Panel

### Dashboard
- Vista general con estadísticas
- Total de productos, servicios, categorías y departamentos
- Accesos rápidos

### Productos
- Listado completo de productos
- Búsqueda en tiempo real
- Filtros por departamento y categoría
- Crear, editar y eliminar productos
- Vista de imágenes de productos
- Gestión de stock y precios
- Productos destacados

### Categorías
- Listado de todas las categorías
- Ver departamento asociado
- Gestión de orden y estado

### Departamentos
- Vista en tarjetas con iconos
- Información de cada departamento
- Colores personalizados

### Servicios
- Vista en tarjetas visuales
- Gestión de precios y tipos
- Servicios destacados
- Categorización

### Configuración
- Cambiar URL de la API
- Herramienta para poblar base de datos
- Configuraciones generales

## 🎨 Diseño

El panel utiliza un diseño moderno con:
- **Sidebar fijo** con navegación
- **Header sticky** con búsqueda global
- **Colores consistentes** con la marca
- **Iconos emoji** para mejor UX
- **Responsive** para móviles y tablets
- **Animaciones sutiles** para mejor feedback

## 🔧 Configuración de la API

Por defecto, el panel se conecta a `http://localhost:5000/api`.

Para cambiar la URL de la API:
1. Ve a Configuración
2. Cambia la URL de la API
3. Haz clic en "Guardar"

## 📊 Endpoints Utilizados

### Productos
- GET `/api/products` - Listar productos
- POST `/api/products` - Crear producto
- PUT `/api/products/:id` - Actualizar producto
- DELETE `/api/products/:id` - Eliminar producto

### Categorías
- GET `/api/categories` - Listar categorías

### Departamentos
- GET `/api/departments` - Listar departamentos

### Servicios
- GET `/api/services` - Listar servicios

## 🚧 Funcionalidades Futuras

- [ ] Autenticación de usuarios
- [ ] Roles y permisos
- [ ] Upload de imágenes
- [ ] Gestión de órdenes
- [ ] Analytics avanzados
- [ ] Exportar datos a Excel/CSV
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Múltiples idiomas

## 📱 Responsive Design

El panel es completamente responsive:
- **Desktop** (1200px+): Sidebar fijo, layout completo
- **Tablet** (768px-1199px): Layout ajustado
- **Mobile** (<768px): Sidebar colapsable, stack vertical

## 🔒 Seguridad

**Nota importante**: Este panel es para uso en desarrollo. Para producción:
- Implementa autenticación JWT
- Usa HTTPS
- Valida todas las entradas
- Implementa CSRF protection
- Limita las peticiones (rate limiting)

## 🎯 Uso

1. Asegúrate de que el backend esté corriendo
2. Abre el panel en tu navegador
3. Navega por las diferentes secciones usando el sidebar
4. Usa los botones "+" para agregar nuevos items
5. Usa los filtros para búsquedas específicas

## 💡 Tips

- **Poblar la base de datos**: Ve a Configuración → Poblar Base de Datos
- **Búsqueda rápida**: Usa la barra de búsqueda global en el header
- **Filtros**: Combina múltiples filtros para búsquedas precisas
- **Mobile**: Usa el botón ☰ para abrir/cerrar el sidebar

## 📄 Archivos

```
admin/
├── index.html       # Estructura HTML
├── styles.css       # Estilos CSS
├── app.js          # Lógica JavaScript
└── README.md       # Esta documentación
```

## 🐛 Solución de Problemas

### El panel no carga datos
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la consola del navegador para errores
- Verifica la URL de la API en Configuración

### Error de CORS
- Asegúrate de que el backend tenga CORS habilitado
- Verifica que la URL del frontend esté en la lista de CORS permitidos

### Los productos no se guardan
- Verifica que todos los campos requeridos estén llenos
- Asegúrate de que existan categorías y departamentos
- Revisa la respuesta del servidor en la consola

## 📝 Licencia

ISC




