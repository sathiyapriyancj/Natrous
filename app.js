const express = require('express');
const { request } = require('http');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { dirname } = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// Global Middleware

// # Security HTTP Headers Helmet at the top of the middleware

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limit from same IP

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests from this IP, please try again in a hour',
});

app.use('/api', limiter);

// Body Parser , reading data from body into req.body

app.use(express.json({ limit: '10kb' }));

// Data Sanitization NoSQL injection

app.use(mongoSanitize());

// Data Sanitization XSS
app.use(xss());

// Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving Static Files

app.use(express.static(`${__dirname}/public`));

// Test Middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.headers;
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// All verbs

app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
