
const mongoose = require('mongoose');
const path = require('path');
const dotenv=require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGO_URI = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


