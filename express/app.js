const express = require('express');
const fs = require('fs');
const { request } = require('http');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Read File In Async Way
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

const getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return response.status(404).json({ error: 'Tour not found' });
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (request, response) => {
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

const updateTour = (req, res) => {
  // Validate if the tour exists
  const tourId = parseInt(req.params.id, 10);

  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // Respond with success and updated tour data
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  // Validate if the tour exists
  const tourId = parseInt(req.params.id, 10);

  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  tours.splice(tourId - 1, 1);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/*

app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

*/

// Refactoring Routes.

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
