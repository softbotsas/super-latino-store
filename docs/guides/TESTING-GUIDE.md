# 🧪 GUÍA DE PRUEBAS - SUPER LATINO STORE

## 🚀 INICIO RÁPIDO

### Servidores necesarios:
```bash
# Terminal 1: Backend
cd super-latino-store/backend
npm run dev

# Terminal 2: Frontend  
cd super-latino-store/frontend
npm run dev

# Terminal 3: Admin
cd super-latino-store/admin
npx http-server -p 8080 -c-1
```

**URLs**:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:8080

---

## ✅ CHECKLIST DE PRUEBAS

### BACKEND API

#### Productos
- [ ] `GET /api/products` - Listar productos
- [ ] `GET /api/products/:id` - Obtener producto
- [ ] `POST /api/products` - Crear producto
- [ ] `PUT /api/products/:id` - Actualizar producto
- [ ] `DELETE /api/products/:id` - Eliminar producto
- [ ] `GET /api/products/featured/list` - Destacados
- [ ] `GET /api/products/:id/related` - Relacionados
- [ ] `GET /api/products/search/advanced` - Búsqueda avanzada

#### Upload
- [ ] `POST /api/upload` - Subir imagen
- [ ] `POST /api/upload/multiple` - Subir múltiples

#### Estadísticas
- [ ] `GET /api/stats/dashboard` - Stats completas
- [ ] `GET /api/stats/products` - Stats de productos

#### Categorías y Departamentos
- [ ] CRUD completo de categorías
- [ ] CRUD completo de departamentos
- [ ] CRUD completo de servicios

---

### FRONTEND - PÁGINAS

#### Home (/)
- [ ] HomeSelector se muestra correctamente
- [ ] Blobs animados funcionan
- [ ] Click en "Explorar Productos" → /catalogo
- [ ] Click en "Ver Servicios" → /servicios
- [ ] Responsive funciona

#### Catálogo (/catalogo)
- [ ] Lista de productos se carga
- [ ] Filtros por departamento funcionan
- [ ] Filtros por categoría funcionan
- [ ] Búsqueda funciona
- [ ] Chips de filtros aparecen
- [ ] Click en chip remueve filtro
- [ ] Paginación funciona
- [ ] Vista grid/lista toggle funciona
- [ ] Skeleton loaders aparecen mientras carga

#### Detalle de Producto (/producto/:id)
- [ ] Información completa se muestra
- [ ] Galería de imágenes funciona
- [ ] Thumbnails seleccionables
- [ ] Botón favorito funciona
- [ ] Selector de cantidad funciona
- [ ] Agregar al carrito funciona
- [ ] Productos relacionados se muestran
- [ ] Breadcrumbs correctos
- [ ] Skeleton loader mientras carga

#### Checkout (/checkout)
- [ ] Formulario completo se muestra
- [ ] Validaciones funcionan
- [ ] Resumen del pedido correcto
- [ ] Cálculo de totales correcto
- [ ] Envío gratis > $35 funciona
- [ ] Botón realizar pedido funciona
- [ ] Breadcrumbs correctos

#### Comparar (/comparar)
- [ ] Tabla comparativa se muestra
- [ ] Productos agregados aparecen
- [ ] Botón eliminar funciona
- [ ] Botón "Limpiar todo" funciona
- [ ] Agregar a carrito desde comparador
- [ ] Estado vacío se muestra correctamente

---

### FRONTEND - COMPONENTES

#### SearchBar
- [ ] Búsqueda en tiempo real funciona
- [ ] Dropdown aparece con resultados
- [ ] Click en producto navega
- [ ] Búsquedas recientes persisten
- [ ] Botón limpiar recientes funciona
- [ ] Click fuera cierra dropdown

#### ProductCard
- [ ] Imagen se muestra correctamente
- [ ] Badges (descuento, destacado) aparecen
- [ ] Botón favorito funciona
- [ ] Botón vista rápida funciona
- [ ] Botón comparar funciona
- [ ] Hover effects funcionan
- [ ] Click en card navega a detalle
- [ ] Botón agregar al carrito funciona

#### Cart
- [ ] Sidebar se abre/cierra
- [ ] Items se muestran
- [ ] Controles de cantidad funcionan
- [ ] Input manual de cantidad funciona
- [ ] Botón eliminar funciona
- [ ] Subtotal correcto
- [ ] Ahorros se calculan bien
- [ ] Impuestos correctos
- [ ] Total correcto
- [ ] Botón checkout funciona
- [ ] Persistencia en LocalStorage

#### QuickViewModal
- [ ] Modal se abre al click
- [ ] Información correcta
- [ ] Imagen se muestra
- [ ] Agregar a carrito funciona
- [ ] Ver detalles navega
- [ ] Click fuera cierra modal
- [ ] Botón X cierra modal

#### Toast
- [ ] Notificaciones aparecen
- [ ] Auto-cierre funciona
- [ ] Botón X funciona
- [ ] Colores correctos por tipo
- [ ] Animaciones suaves

#### SkeletonLoader
- [ ] Aparece mientras carga
- [ ] Desaparece al cargar datos
- [ ] Diferentes tipos funcionan

---

### ADMIN PANEL

#### Dashboard
- [ ] 6 estadísticas se muestran
- [ ] Datos en tiempo real
- [ ] Totales correctos
- [ ] Stock bajo se calcula
- [ ] Valor inventario correcto

#### Productos
- [ ] Listado se muestra
- [ ] Filtros funcionan (departamento, categoría, stock)
- [ ] Búsqueda funciona
- [ ] Botón "Nuevo Producto" abre modal
- [ ] Formulario completo
- [ ] Upload de imagen funciona
- [ ] Preview de imagen funciona
- [ ] Campo URL alternativa funciona
- [ ] Crear producto funciona
- [ ] Editar producto funciona (✏️)
- [ ] Eliminar producto funciona (🗑️)
- [ ] Confirmación personalizada aparece
- [ ] Modo bulk funciona
- [ ] Seleccionar todos funciona
- [ ] Eliminar seleccionados funciona
- [ ] Paginación funciona

#### Categorías
- [ ] Listado se muestra
- [ ] Botón "Nueva Categoría" funciona
- [ ] Crear categoría funciona
- [ ] Editar categoría funciona
- [ ] Eliminar categoría funciona
- [ ] Select de departamento funciona

#### Departamentos
- [ ] Grid se muestra
- [ ] Botón "Nuevo Departamento" funciona
- [ ] Crear departamento funciona
- [ ] Selector de color funciona
- [ ] Campo emoji funciona
- [ ] Editar departamento funciona
- [ ] Eliminar departamento funciona

---

## 🎯 ESCENARIOS DE PRUEBA

### Escenario 1: Crear Producto Completo
1. Ir a Admin → Productos
2. Click "➕ Nuevo Producto"
3. Nombre: "Test Product"
4. SKU: "TEST-001" (único)
5. Precio: 99.99
6. Stock: 50
7. Seleccionar departamento
8. Seleccionar categoría
9. Descripción: "Producto de prueba"
10. Subir imagen o URL
11. Descuento: 10%
12. Marcar "Destacado"
13. Click "Guardar"
14. **Verificar**: Aparece en lista
15. **Verificar**: Aparece en Frontend → Catálogo
16. **Verificar**: Aparece en Productos Destacados

### Escenario 2: Proceso de Compra Completo
1. Frontend → Catálogo
2. Buscar producto
3. Usar filtros
4. Click en producto → Detalle
5. Agregar a favoritos ❤️
6. Seleccionar cantidad
7. Agregar al carrito
8. Ver carrito sidebar
9. Modificar cantidad
10. Click "Proceder al Pago"
11. Completar formulario checkout
12. Realizar pedido
13. **Verificar**: Carrito se limpia
14. **Verificar**: Redirección a home

### Escenario 3: Comparar Productos
1. Frontend → Catálogo
2. Hover en producto 1 → 📊
3. Hover en producto 2 → 📊
4. Hover en producto 3 → 📊
5. Ir a `/comparar`
6. **Verificar**: Tabla con 3 productos
7. **Verificar**: Todas las características
8. Agregar uno al carrito
9. Eliminar uno de comparación
10. **Verificar**: Persiste al recargar

### Escenario 4: Búsqueda y Filtros
1. Frontend → Catálogo
2. Buscar "Samsung"
3. **Verificar**: Chip de búsqueda aparece
4. Filtrar por departamento
5. **Verificar**: Chip de departamento
6. Filtrar por precio
7. **Verificar**: Chip de precio
8. Click en chip individual
9. **Verificar**: Filtro se remueve
10. Click "Limpiar todo"
11. **Verificar**: Todos los filtros cleared

### Escenario 5: Vista Rápida
1. Catálogo → Hover en producto
2. Click 👁️ Vista rápida
3. **Verificar**: Modal aparece
4. **Verificar**: Info correcta
5. Click "Agregar al Carrito"
6. **Verificar**: Se agrega y modal cierra
7. **Verificar**: Carrito se abre

### Escenario 6: Bulk Delete
1. Admin → Productos
2. Click "☑️ Selección Múltiple"
3. **Verificar**: Checkboxes aparecen
4. Seleccionar 3-5 productos
5. Click "🗑️ Eliminar Seleccionados"
6. Confirmar
7. **Verificar**: Productos eliminados
8. **Verificar**: Dashboard actualizado
9. **Verificar**: Notificación de éxito

---

## 🐛 TROUBLESHOOTING

### Frontend no carga productos
- **Verificar**: Backend corriendo en puerto 5000
- **Verificar**: MongoDB conectado
- **Verificar**: Consola del navegador sin errores

### Admin no muestra imágenes
- **Verificar**: URLs de imagen correctas
- **Verificar**: Carpeta `public/uploads` existe
- **Verificar**: Servidor sirve archivos estáticos

### Carrito no persiste
- **Verificar**: LocalStorage habilitado
- **Verificar**: Consola sin errores
- **Verificar**: Store de cart funcionando

### Comparador no funciona
- **Verificar**: Store de compare importado
- **Verificar**: LocalStorage funcionando
- **Verificar**: Ruta `/comparar` existe

---

## 📊 MÉTRICAS ESPERADAS

### Dashboard Admin
- Total Productos: Variable (según BD)
- Total Servicios: 13+
- Total Categorías: 29+
- Total Departamentos: 10+
- Stock Bajo: Calculado dinámicamente
- Valor Inventario: Suma de (precio × stock)

### Frontend
- Productos en catálogo: Todos activos
- Productos destacados: Solo featured=true
- Productos relacionados: Máximo 8
- Comparador: Máximo 3
- Favoritos: Ilimitados

---

## ✅ VALIDACIONES A VERIFICAR

### Backend
- SKU único por producto
- Precio >= 0
- Stock >= 0
- Descuento 0-100%
- Rating 0-5
- Categoría y departamento requeridos

### Frontend
- Stock no puede ser negativo en carrito
- Cantidad máxima = stock disponible
- Comparador máximo 3 productos
- Upload máximo 5MB
- Formatos imagen válidos

### Admin
- Todos los campos requeridos validados
- Imagen o URL requerida para crear
- Departamento antes de categoría
- Confirmación en eliminaciones
- Preview antes de guardar

---

## 🎉 TESTING COMPLETO

Si todas las pruebas pasan:
- ✅ **Backend**: Funcionando al 100%
- ✅ **Frontend**: Todas las funcionalidades operativas
- ✅ **Admin**: CRUD completo funcional
- ✅ **Integración**: Todo conectado correctamente

**¡El proyecto está listo para producción (con autenticación pendiente)!** 🚀

---

*Guía de pruebas generada el 29 de Octubre, 2025*


