// Middleware de manejo de errores global

// Error personalizado
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Manejo de errores de MongoDB
const handleCastErrorDB = (err) => {
  const message = `Recurso no válido: ${err.path} = ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'campo duplicado';
  const message = `Valor duplicado: ${value}. Por favor usa otro valor.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos inválidos. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Enviar error en desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Enviar error en producción
const sendErrorProd = (err, res) => {
  // Error operacional confiable: enviar mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } else {
    // Error de programación: no filtrar detalles al cliente
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Algo salió muy mal!'
    });
  }
};

// Middleware principal de manejo de errores
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Manejo de errores específicos de MongoDB
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const err = new AppError(`Ruta ${req.originalUrl} no encontrada`, 404);
  next(err);
};

// Wrapper para funciones async (elimina try-catch)
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  catchAsync
};








