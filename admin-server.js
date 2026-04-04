const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos del directorio admin
app.use(express.static(path.join(__dirname, 'admin')));

// Ruta por defecto - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de desarrollo del admin panel corriendo en http://localhost:${PORT}`);
  console.log(`📊 Backend API debe estar corriendo en http://localhost:5000`);
});