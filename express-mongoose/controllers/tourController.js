const { response, json } = require('express');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (request, response) => {
  try {
    console.log(request.query);

    // 1. FILTERING

    // Create a shallow copy of the query object
    const queryObject = { ...request.query };

    // Fields to exclude from the query object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Remove excluded fields from the query object
    excludedFields.forEach((field) => delete queryObject[field]);

    // 2. ADVANCED FILTERING

    // Mongodb Query { difficulty: 'easy', duration: { $gte: '5' } }

    // URL Parameter { difficulty: 'easy', duration: { gte: '5' } }

    // gte , gt , lte , lt

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (request.query.sort) {
      const sortBy = request.query.sort.split(',').join(' ');

      query = query.sort(sortBy);
    } else {
      // Default one
      query = query.sort('-createdAt');
    }

    const tours = await query;

    response.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTour = async (request, response) => {
  try {
    const tour = await Tour.findById(request.params.id);
    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

/*


1. Ajax with try catch block 

2. findByIdAndUpdate ()

2. There are 3 parameters first one is id , second request body , third one we always want this method is to actually return that new document

*/

exports.updateTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndDelete(request.params.id);

    if (!tour) {
      return response.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
