const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

// Load environment variables
dotenv.config({ path: './config.env' });

// Replace database password in connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Hey Ninja, DB connection successful');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the database
connectDB();

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.error('Error importing data:', error.message);
  }
  process.exit();
};

// Delete all data from the collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.error('Error deleting data:', error.message);
  }
  process.exit();
};

// Check command-line arguments and execute the corresponding function
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
