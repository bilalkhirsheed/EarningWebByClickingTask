const express = require('express');
const mongoose = require('mongoose');

const app = express();
const MONGO_URI = "mongodb+srv://bilalsonofkhirsheed:2249263%40MongoDb@cluster0.dp5gbye.mongodb.net/BadarBhai?retryWrites=true&w=majority&appName=Cluster0"


// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

app.use(express.json());

// Your existing routes and middleware
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Your existing code for serving static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


