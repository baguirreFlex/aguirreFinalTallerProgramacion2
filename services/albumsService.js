// Desactivar verificación SSL a nivel de proceso
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const axios = require('axios');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class AlbumsService {
  constructor() {
    this.csvPath = path.resolve(config.albumsCsvPath);
    this.apiUrl = 'https://jsonplaceholder.typicode.com/albums';
    
    // Configurar axios para ignorar errores de certificado SSL
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
    
    this.axiosInstance = axios.create({
      httpsAgent: httpsAgent,
      timeout: 10000
    });
  }

  async ensureDirectory() {
    const dir = path.dirname(this.csvPath);
    await fs.mkdir(dir, { recursive: true });
  }

  async fetchAndSaveAlbums() {
    try {
      // Hacer GET a la API externa usando la instancia configurada
      const response = await this.axiosInstance.get(this.apiUrl);
      const albums = response.data;

      // Tomar los primeros 15 items
      const first15 = albums.slice(0, 15);

      // Convertir a CSV
      const csvHeader = 'userId,id,title\n';
      const csvRows = first15.map(album => {
        const title = album.title ? `"${album.title.replace(/"/g, '""')}"` : '';
        return `${album.userId},${album.id},${title}`;
      });
      const csvContent = csvHeader + csvRows.join('\n');

      // Guardar en archivo
      await this.ensureDirectory();
      await fs.writeFile(this.csvPath, csvContent, 'utf8');

      return csvContent;
    } catch (error) {
      throw new Error(`Error al obtener albums: ${error.message}`);
    }
  }

  async getAlbumsCsv() {
    try {
      // Intentar leer el archivo existente
      const csvContent = await fs.readFile(this.csvPath, 'utf8');
      return csvContent;
    } catch (error) {
      // Si no existe, generarlo
      return await this.fetchAndSaveAlbums();
    }
  }

  async refreshAlbumsCsv() {
    return await this.fetchAndSaveAlbums();
  }
}

module.exports = AlbumsService;

