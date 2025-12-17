const AlbumsService = require('../services/albumsService');

class AlbumsController {
  constructor() {
    this.albumsService = new AlbumsService();
  }

  async getCsv(req, res) {
    try {
      const csvContent = await this.albumsService.getAlbumsCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=albums_15.csv');
      return res.status(200).send(csvContent);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message
      });
    }
  }
}

module.exports = new AlbumsController();

