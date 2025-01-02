const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide both email and password!', 400));
  }

  // Find the user by email and include password in the result
  const user = await User.findOne({ email }).select('+password');

  // If no user is found or the password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Generate a token for the user
  const token = signToken(user._id);

  // Send the response with the token
  response.status(200).json({
    status: 'success',
    token,
  });
});

// Protecting Routes

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it is there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //  Validate token #verification.

  if (!token) {
    return next(
      new AppError('You are not logged in! please login to get access', 401),
    );
  }
});
