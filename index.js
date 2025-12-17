// Desactivar verificación SSL a nivel de proceso
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`DB Provider: ${config.dbProvider}`);
});

