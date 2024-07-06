const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose.js');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./router.js'); // Adjust the path as necessary

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Define CORS options
// const corsOptions = {
//     origin: 'https://www.ernings.online', // Replace with your actual frontend URL
//     methods: ['GET', 'POST'], // Add the HTTP methods you support
//     allowedHeaders: ['Content-Type', 'Authorization'], // Add the headers you want to allow
//   };
  
 
//   app.use(cors(corsOptions));
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

app.use('/api', userRoutes);

