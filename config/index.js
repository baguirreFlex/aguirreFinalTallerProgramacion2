require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  dbProvider: process.env.DB_PROVIDER || 'json',
  jwtSecret: process.env.JWT_SECRET || 'secret-key-change-in-production',
  apiKey: process.env.API_KEY || 'test-api-key-12345',
  databasePath: process.env.DATABASE_PATH || './database/database.json',
  albumsCsvPath: process.env.ALBUMS_CSV_PATH || './database/albums_15.csv'
};

