class Producto {
  constructor(data) {
    this.id = data.id;
    this.producto = data.producto;
    this.stockAmount = data.stockAmount;
    this.fechaIngreso = data.fechaIngreso || new Date().toISOString().split('T')[0];
  }

  toJSON() {
    return {
      id: this.id,
      producto: this.producto,
      stockAmount: this.stockAmount,
      fechaIngreso: this.fechaIngreso
    };
  }
}

module.exports = Producto;

