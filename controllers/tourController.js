const { response, json, request } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.fields = 'name,price,ratingsAverage';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTourStats = async (request, response) => {
  try {
    const stats = await Tour.aggregate([
      /*
      Match
        - to select or filter certain documents.
        - It is a preliminary stage.
      */

      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },

      /*

      Group

        - It allows us to group documents together basically using accumulator
        - Id is specify what we want to group by
        - Null is everything in one group so that we can calculate.

      */

      {
        $group: {
          // _id: null,
          // _id: '$difficulty', // specific field
          // _id: '$ratingsAverage', // specific field
          _id: { $toUpper: '$difficulty' }, // specific field
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },

      { $sort: { avgPrice: 1 } },
      // { $match: { __id: { $ne: 'EASY' } } },
    ]);

    // Send response with computed statistics
    response.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (error) {
    // Handle errors and send failure response
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getMonthlyPlan = async (request, response) => {
  try {
    const year = request.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      /*
      unwind 

      1. unwind is gonna do is basically deconstruct an array field from the info documents and then output one document for each element of the array.

      2. 

      */
      { $unwind: '$startDates' },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },

      {
        // Rename
        $addFields: { month: '$_id' },
      },

      {
        $project: {
          // 0 not show , 1 will show
          _id: 0,
        },
      },
      { $sort: { numToursStarts: -1 } },
      {
        $limit: 6,
      },
    ]);
    response.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (error) {
    response.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
