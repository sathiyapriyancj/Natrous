const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Hey Ninja DB connection successful');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
