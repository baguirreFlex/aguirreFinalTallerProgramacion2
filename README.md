# API RESTful - Gestión de Productos (Stock)

API RESTful desarrollada en Node.js con Express para gestionar productos y su stock.

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd examenFinalTallerProgramacion2
```

2. Instalar dependencias:
```bash
npm install
```
## Levantar el Proyecto

### Modo JSON (Base de datos local)

El proyecto está configurado por defecto para usar archivo JSON local.

1. Iniciar el servidor:
```bash
npm start
```

O en modo desarrollo
```bash
npm run dev
```

2. El servidor estará disponible en `http://localhost:3000`

3. La base de datos se creará automáticamente en `./database/database.json` al realizar la primera operación.

## Estructura del Proyecto

```
proyecto-stock-api/
├── app.js                    # Punto de entrada, configuración de Express
├── config/
│   └── index.js             # Carga variables de entorno
├── controllers/
│   ├── productoController.js
│   └── albumsController.js
├── models/
│   └── producto.js          # Esquema/DTO
├── repository/
│   └── productoRepositoryJson.js
├── routes/
│   ├── productoRoutes.js
│   └── albumsRoutes.js
├── services/
│   ├── albumsService.js     # Lógica para consumir jsonplaceholder
│   └── productoService.js    # Lógica de negocio para productos
├── middlewares/
│   └── authMiddleware.js    # Valida JWT
├── tests/
│   └── test.endpoints.http  # Tests HTTP (REST Client)
├── database/
│   ├── database.json        # Base de datos JSON (se crea automáticamente)
│   └── albums_15.csv        # CSV generado por /albums/csv
├── index.js                 # Instancia del servidor
└── package.json
```

## Endpoints

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/productos` | Crear producto | No |
| GET | `/api/v1/productos` | Listar productos | No |
| GET | `/api/v1/productos/:id` | Obtener producto | No |
| PUT | `/api/v1/productos/:id` | Editar producto | Sí |
| DELETE | `/api/v1/productos/:id` | Eliminar producto | Sí |

### Albums

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/albums/csv` | Descargar/generar CSV | No |

## Autenticación

Los endpoints protegidos (PUT y DELETE) requieren autenticación mediante JWT.

Agregar header:
```
Authorization: Bearer <token>
```

Para generar un token JWT de prueba:
```bash
node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({userId:1}, 'secret-key-change-in-production', {expiresIn:'1h'}))"
```

## Modelo de Datos - Producto

```json
{
  "id": "uuid-generado-por-sistema",
  "producto": "string - requerido, no vacío",
  "stockAmount": "integer ≥ 0 - requerido",
  "fechaIngreso": "date (YYYY-MM-DD) - opcional, por defecto fecha actual"
}
```

## Reglas de Negocio

- Al crear: `stockAmount` debe ser entero ≥ 0
- Al actualizar: `stockAmount` debe ser entero ≥ 0
- El campo `producto` es requerido y no puede estar vacío
- `fechaIngreso` se asigna automáticamente si no se proporciona

## Formato de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "statusCode": 400,
  "error": "Mensaje descriptivo"
}
```

## Testing

El proyecto incluye un archivo `tests/test.endpoints.http` con ejemplos de todas las operaciones.

### Usar con REST Client

1. Instalar la extensión "REST Client" en VSCode
2. Abrir el archivo `tests/test.endpoints.http`
3. Hacer clic en "Send Request" sobre cada petición

## Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/v1/productos \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "Laptop Dell XPS 15",
    "stockAmount": 10
  }'
```

### Listar productos
```bash
curl http://localhost:3000/api/v1/productos
```

### Actualizar producto (requiere autenticación JWT)
```bash
curl -X PUT http://localhost:3000/api/v1/productos/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "stockAmount": 15
  }'
```

### Obtener CSV de albums
```bash
curl http://localhost:3000/api/v1/albums/csv
```

## Notas

- La base de datos JSON se crea automáticamente en `./database/database.json`
- El archivo CSV de albums se genera en `./database/albums_15.csv` al acceder al endpoint


