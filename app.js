const express = require('express');
const config = require('./config');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const productoRoutes = require('./routes/productoRoutes');
const albumsRoutes = require('./routes/albumsRoutes');

app.use('/api/v1/productos', productoRoutes);
app.use('/api/v1/albums', albumsRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    statusCode: 500,
    error: 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Ruta no encontrada'
  });
});

module.exports = app;

