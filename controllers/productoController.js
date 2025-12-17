const ProductoService = require('../services/productoService');
const ProductoRepositoryJson = require('../repository/productoRepositoryJson');

// Inicializar repositorio y servicio
const productoRepository = new ProductoRepositoryJson();
const productoService = new ProductoService(productoRepository);

class ProductoController {
  async create(req, res) {
    try {
      const producto = await productoService.createProducto(req.body);
      return res.status(201).json(producto);
    } catch (error) {
      return res.status(400).json({
        statusCode: 400,
        error: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const productos = await productoService.getAllProductos();
      return res.status(200).json(productos);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const producto = await productoService.getProductoById(req.params.id);
      return res.status(200).json(producto);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          statusCode: 404,
          error: error.message
        });
      }
      return res.status(500).json({
        statusCode: 500,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const producto = await productoService.updateProducto(req.params.id, req.body);
      return res.status(200).json(producto);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          statusCode: 404,
          error: error.message
        });
      }
      return res.status(400).json({
        statusCode: 400,
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      await productoService.deleteProducto(req.params.id);
      return res.status(200).json({
        message: 'Producto eliminado correctamente'
      });
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          statusCode: 404,
          error: error.message
        });
      }
      return res.status(500).json({
        statusCode: 500,
        error: error.message
      });
    }
  }
}

module.exports = new ProductoController();

