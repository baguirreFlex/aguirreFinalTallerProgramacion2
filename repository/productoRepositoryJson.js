const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class ProductoRepositoryJson {
  constructor() {
    this.dbPath = path.resolve(config.databasePath);
    this.ensureDatabaseFile();
  }

  async ensureDatabaseFile() {
    try {
      await fs.access(this.dbPath);
    } catch (error) {
      // Si el archivo no existe, crear el directorio y el archivo con array vacío
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.dbPath, JSON.stringify([], null, 2), 'utf8');
    }
  }

  async readDatabase() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeDatabase(data) {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
  }

  async findAll() {
    const products = await this.readDatabase();
    return products;
  }

  async findById(id) {
    const products = await this.readDatabase();
    return products.find(p => p.id === id) || null;
  }

  async create(producto) {
    const products = await this.readDatabase();
    products.push(producto);
    await this.writeDatabase(products);
    return producto;
  }

  async update(id, updates) {
    const products = await this.readDatabase();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    products[index] = { ...products[index], ...updates };
    await this.writeDatabase(products);
    return products[index];
  }

  async delete(id) {
    const products = await this.readDatabase();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    await this.writeDatabase(products);
    return true;
  }
}

module.exports = ProductoRepositoryJson;

