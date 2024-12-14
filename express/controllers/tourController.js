const { response } = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (request, response, next, value) => {
  console.log(`Tour id is: ${value}`);

  const tourId = Number(value); // Convert `value` to a number
  if (tourId > tours.length || tourId <= 0) {
    return response.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  next();
};
exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return response.status(500).json({
          status: 'error',
          message: 'Failed to save the data',
        });
      }

      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  // Validate if the tour exists
  const tourId = parseInt(req.params.id, 10);

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  const tourId = parseInt(req.params.id, 10);

  tours.splice(tourId - 1, 1);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
