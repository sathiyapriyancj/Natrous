const request = require('supertest');
const express = require('express');
const morgan = require('morgan');
const app = express();

// Mock routes (replace with your actual route imports)
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middleware setup
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Tests
describe('Application Routes', () => {
  let server;

  // Before all tests, start the server
  beforeAll(() => {
    server = app.listen(8000); // Start server for tests
  });

  // After all tests, stop the server
  afterAll(() => {
    server.close(); // Close server after tests
  });

  it('should return 200 for the tours route', async () => {
    const response = await request(app).get('/api/v1/tours');
    expect(response.statusCode).toBe(200);
  });

  it('should return 200 for the users route', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 for an invalid route', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.statusCode).toBe(404);
  });

  it('should serve static files from the public directory', async () => {
    const response = await request(app).get('/path/to/actual/file.txt'); // Update with a real file path
    expect(response.statusCode).toBe(200);
  });
});
