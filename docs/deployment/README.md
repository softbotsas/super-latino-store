# Deploy VPS - Super Latino Store

Este documento describe la configuracion de produccion que quedo funcionando en el VPS para:

- https://superlatinostore.com (frontend tienda)
- https://admin.superlatinostore.com (panel admin)
- API backend Node.js en puerto 5000 (via Apache reverse proxy)

## 1. Infraestructura final

- SO: Ubuntu 25.10
- Apache: 2.4.x
- Node.js: 20.x
- PM2: 6.x
- MongoDB: 7.0.x (local en el VPS)
- Repo: /var/www/super-latino-store
- Dominio principal: superlatinostore.com
- Subdominio admin: admin.superlatinostore.com
- SSL: Let's Encrypt (certbot)

## 2. Estructura de despliegue en servidor

Ruta base del proyecto:

```bash
/var/www/super-latino-store
```

Rutas importantes:

- Frontend build: /var/www/super-latino-store/frontend/dist
- Admin build: /var/www/super-latino-store/admin-vue/dist
- Backend app: /var/www/super-latino-store/backend/server.js
- Uploads publicos backend: /var/www/super-latino-store/backend/public/uploads

## 3. Variables de entorno

### 3.1 Backend

Archivo: /var/www/super-latino-store/backend/.env

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/superlatino
JWT_SECRET=CAMBIAR_ESTE_VALOR
NODE_ENV=production
```

Notas:

- `JWT_SECRET` debe ser largo y secreto.
- MongoDB corre localmente, por eso se usa 127.0.0.1.

### 3.2 Frontend y admin (build-time)

Se agregaron estos archivos al repo para evitar que el build apunte a localhost:

- frontend/.env.production
- admin-vue/.env.production

Contenido:

```env
VITE_API_URL=/api
```

Esto hace que el frontend/admin use rutas relativas (`/api/...`) y Apache las proxee al backend.

## 4. Apache - VirtualHosts de produccion

Sitios habilitados:

- /etc/apache2/sites-available/superlatinostore.com-le-ssl.conf
- /etc/apache2/sites-available/admin.superlatinostore.com-le-ssl.conf

Patron usado en ambos:

- `DocumentRoot` al `dist` de cada app
- `ProxyPass /api` -> `http://127.0.0.1:5000/api`
- `ProxyPass /uploads` -> `http://127.0.0.1:5000/uploads`
- Reglas SPA para enviar rutas no-archivo a `index.html`

### 4.1 Config recomendada de rewrite (clave)

La regla SPA debe excluir assets para evitar error MIME (`text/html` en archivos .js/.css):

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api
RewriteCond %{REQUEST_URI} !^/uploads
RewriteCond %{REQUEST_URI} !^/assets/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

Si falta `!^/assets/`, Apache puede devolver `index.html` para `assets/*.js` y la app queda en blanco.

## 5. SSL y certificados

Certificados emitidos con certbot:

- superlatinostore.com + www.superlatinostore.com
- admin.superlatinostore.com

Verificacion de certificados:

```bash
echo | openssl s_client -servername superlatinostore.com -connect superlatinostore.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates
echo | openssl s_client -servername admin.superlatinostore.com -connect admin.superlatinostore.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

## 6. DNS (GoDaddy)

Configuracion final usada:

- A @ -> IP del VPS
- A admin -> IP del VPS
- CNAME www -> superlatinostore.com

Nota: si certbot falla por DNS, esperar propagacion y reintentar.

## 7. PM2 (backend)

Proceso:

- Nombre: `superlatino-api`
- Entry point: `backend/server.js`

Comandos utiles:

```bash
pm2 start backend/server.js --name superlatino-api
pm2 restart superlatino-api
pm2 status
pm2 logs superlatino-api --lines 100
pm2 save
```

## 8. Script de despliegue

Se usa script global en el VPS:

```bash
/usr/local/bin/deploy-superlatino
```

Flujo esperado del script:

1. `git pull` en `/var/www/super-latino-store`
2. instalar dependencias (`npm ci` donde aplique)
3. build frontend (`frontend`) y admin (`admin-vue`)
4. `pm2 restart superlatino-api`
5. recargar Apache si aplica

## 9. Validaciones post-deploy

### 9.1 Servicios

```bash
systemctl status apache2 --no-pager
systemctl status mongod --no-pager
pm2 status
```

### 9.2 API y assets

```bash
curl -I https://superlatinostore.com/api/products?limit=1
curl -I https://superlatinostore.com/assets/index-*.js
curl -I https://superlatinostore.com/assets/index-*.css
```

Esperado:

- `/api/...` responde JSON (200/304 segun cache)
- `.js` con `Content-Type: text/javascript` (o `application/javascript`)
- `.css` con `text/css`

### 9.3 Frontend funcional

- Home carga sin pantalla en blanco
- Productos cargan desde API
- Imagenes cargan desde `/uploads/...`
- Admin abre en subdominio y consume la misma API

## 10. Troubleshooting rapido

### Problema: pantalla en blanco + MIME error en JS

Sintoma:

- `Failed to load module script ... MIME type text/html`

Causa:

- Rewrite de Apache atrapando `/assets/...`

Solucion:

- Agregar exclusion `RewriteCond %{REQUEST_URI} !^/assets/`
- Recargar Apache:

```bash
apachectl configtest && systemctl reload apache2
```

### Problema: CORS / loopback address space / localhost:5000

Sintoma:

- Navegador intenta llamar `http://localhost:5000/...` desde dominio HTTPS

Causa:

- Build de frontend/admin hecho sin `VITE_API_URL=/api`
- O codigo con URL hardcodeada a localhost

Solucion:

1. Confirmar `frontend/.env.production` y `admin-vue/.env.production` con `VITE_API_URL=/api`
2. Confirmar que el codigo use `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`
3. Rebuild y redeploy

## 11. Comandos de referencia

```bash
# Apache
apachectl configtest
systemctl reload apache2

# Mongo
systemctl status mongod --no-pager

# PM2
pm2 status
pm2 logs superlatino-api --lines 100

# Deploy
/usr/local/bin/deploy-superlatino
```

## 12. Estado funcional alcanzado

Configuracion final estable:

- SSL activo en ambos dominios
- Backend online con PM2
- MongoDB local operativo
- Frontend y admin sirviendo builds de Vite
- API y uploads por reverse proxy Apache
- Reglas SPA corregidas para no romper assets
- Frontend/admin compilados con `VITE_API_URL=/api`
