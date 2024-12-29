const AppError = require('./../utils/appError');

describe('AppError Class', () => {
  it('should create an AppError instance with the correct message and statusCode', () => {
    const message = 'Invalid Tour ID';
    const statusCode = 400;
    const error = new AppError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should set status to "error" for non-4xx statusCode', () => {
    const message = 'Internal Server Error';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.status).toBe('error');
  });

  it('should capture the stack trace', () => {
    const message = 'Something went wrong';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.stack).toBeDefined();
    // Check if stack trace contains the error message or part of the stack (like the location)
    expect(error.stack).toContain('Something went wrong');
    // Alternatively, you can check for a part of the stack trace, such as file name or line number.
    expect(error.stack).toContain('tourController.test.js'); // Adjust the filename as per your actual test file name
  });

  it('should handle a 404 statusCode correctly', () => {
    const message = 'Tour not found';
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error.status).toBe('fail');
    expect(error.statusCode).toBe(404);
  });

  it('should handle a 500 statusCode correctly', () => {
    const message = 'Server error';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.status).toBe('error');
    expect(error.statusCode).toBe(500);
  });
});
