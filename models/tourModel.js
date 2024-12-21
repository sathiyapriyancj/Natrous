const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, 'A tour must have a name'],

      unique: true,

      trim: true,
    },
    slug: String,
    duration: {
      type: Number,

      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,

      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty '],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,

      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/*

1. Document Middleware : Runs before .save() and .create() but not .insertMany

2.  Before event.

3. can have multiple pre for same hook And hook is what we call this save here.


*/

// tourSchema.pre('save', function (next) {
// this keyword is currently processed document
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save document....');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
// not access to next but the document that was just saved to the database.

//   console.log(doc);
//   next();
// });

// Query Middleware - find is focus on a query middleware
// tourSchema.pre(/^find/, function (next) { it execute when start with find.

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // To measure how many clock
  this.start = Date.now();
  next();
});

// each query
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// Post Query Middleware

tourSchema.post(/^find/, function (docs, next) {
  // To calculate how many clock
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  console.log(docs);
  next();
});

// Aggregation Middleware

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
