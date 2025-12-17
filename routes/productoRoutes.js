const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/v1/productos - No requiere autenticación
router.post('/', productoController.create.bind(productoController));

// GET /api/v1/productos - No requiere autenticación
router.get('/', productoController.getAll.bind(productoController));

// GET /api/v1/productos/:id - No requiere autenticación
router.get('/:id', productoController.getById.bind(productoController));

// PUT /api/v1/productos/:id - REQUIERE autenticación
router.put('/:id', authMiddleware, productoController.update.bind(productoController));

// DELETE /api/v1/productos/:id - REQUIERE autenticación
router.delete('/:id', authMiddleware, productoController.delete.bind(productoController));

module.exports = router;

