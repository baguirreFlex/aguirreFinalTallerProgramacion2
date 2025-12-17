const { v4: uuidv4 } = require('uuid');
const Producto = require('../models/producto');
const config = require('../config');

class ProductoService {
  constructor(repository) {
    this.repository = repository;
  }

  async createProducto(data) {
    // Validaciones
    if (!data.producto || data.producto.trim() === '') {
      throw new Error('El campo producto es requerido y no puede estar vacío');
    }

    if (data.stockAmount === undefined || data.stockAmount === null) {
      throw new Error('El campo stockAmount es requerido');
    }

    const stockAmount = parseInt(data.stockAmount);
    if (isNaN(stockAmount) || stockAmount < 0) {
      throw new Error('stockAmount debe ser un entero mayor o igual a 0');
    }

    // fechaIngreso es opcional, si no se proporciona se asigna la fecha actual
    const fechaIngreso = data.fechaIngreso && data.fechaIngreso.trim() !== '' 
      ? data.fechaIngreso.trim() 
      : new Date().toISOString().split('T')[0];

    const producto = new Producto({
      id: uuidv4(),
      producto: data.producto.trim(),
      stockAmount: stockAmount,
      fechaIngreso: fechaIngreso
    });

    return await this.repository.create(producto.toJSON());
  }

  async getAllProductos() {
    return await this.repository.findAll();
  }

  async getProductoById(id) {
    const producto = await this.repository.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async updateProducto(id, data) {
    const producto = await this.repository.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const updates = {};

    if (data.producto !== undefined) {
      if (data.producto.trim() === '') {
        throw new Error('El campo producto no puede estar vacío');
      }
      updates.producto = data.producto.trim();
    }

    if (data.stockAmount !== undefined) {
      const stockAmount = parseInt(data.stockAmount, 10);
      if (isNaN(stockAmount) || stockAmount < 0) {
        throw new Error('stockAmount debe ser un entero mayor o igual a 0');
      }
      
      // Validar que el nuevo stock solo puede ser +1 o -1 del stock actual
      const stockActual = parseInt(producto.stockAmount, 10);
      if (isNaN(stockActual)) {
        throw new Error('El stock actual del producto no es un número válido');
      }
      
      const diferencia = stockAmount - stockActual;
      
      // Validación estricta: solo permitir diferencia de +1 o -1
      if (diferencia !== 1 && diferencia !== -1) {
        const opcionesPermitidas = stockActual === 0 
          ? `${stockActual + 1}` 
          : `${stockActual + 1} o ${stockActual - 1}`;
        throw new Error(`El stock solo puede incrementarse o decrementarse de a uno. Stock actual: ${stockActual}, nuevo stock permitido: ${opcionesPermitidas}`);
      }
      
      // Si intenta decrementar cuando el stock es 0, rechazar
      if (diferencia === -1 && stockActual === 0) {
        throw new Error('No se puede decrementar el stock cuando es 0. Solo se permite incrementar a 1');
      }
      
      updates.stockAmount = stockAmount;
    }

    if (data.fechaIngreso !== undefined) {
      updates.fechaIngreso = data.fechaIngreso;
    }

    const updated = await this.repository.update(id, updates);
    return updated;
  }

  async incrementStock(id, increment) {
    const incrementValue = parseInt(increment);
    if (isNaN(incrementValue) || incrementValue < 1) {
      throw new Error('El incremento debe ser un entero mayor o igual a 1');
    }

    const producto = await this.repository.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const newStock = producto.stockAmount + incrementValue;
    return await this.repository.update(id, { stockAmount: newStock });
  }

  async deleteProducto(id) {
    const producto = await this.repository.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    await this.repository.delete(id);
    return true;
  }
}

module.exports = ProductoService;

