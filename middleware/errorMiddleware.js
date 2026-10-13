// middleware/errorMiddleware.js — centralised 404 + error handling

// Route na mile to ye chalta hai
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route nahi mila: ${req.originalUrl}`));
};

// Global error handler — hamesha JSON response bhejta hai
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // production me stack trace expose mat karo
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
