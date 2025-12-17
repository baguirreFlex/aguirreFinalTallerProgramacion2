const express = require('express');
const router = express.Router();
const albumsController = require('../controllers/albumsController');

// GET /api/v1/albums/csv 
router.get('/csv', albumsController.getCsv.bind(albumsController));

module.exports = router;

