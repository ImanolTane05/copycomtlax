// backend/middleware/metricsMiddleware.js

const client = require('prom-client');

// 1. Recolección de métricas por defecto (CPU, memoria, GC, etc. de Node.js)
client.collectDefaultMetrics({ prefix: 'node_app_' });

// 2. Definición de la métrica de contador HTTP
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP a la aplicación, con desglose por método, ruta y código de estado.',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware para contar las peticiones y medir el tiempo (Histograma)
// Usamos un middleware después de todas las rutas para capturar el código de estado final.
const monitorMiddleware = (req, res, next) => {
  // Cuando la respuesta finaliza (después de que se ejecuta la ruta):
  res.on('finish', () => {
    // Incrementamos el contador de peticiones
    httpRequestCounter.inc({
      method: req.method,
      // Usamos el path original de la ruta para agrupar mejor las métricas
      route: req.baseUrl + req.path,
      status_code: res.statusCode,
    });
  });
  next();
};

// Middleware para exponer el endpoint /metrics
const metricsRoute = async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
};

module.exports = {
  monitorMiddleware,
  metricsRoute,
};