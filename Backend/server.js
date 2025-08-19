const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose.js');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./router.js'); // Adjust the path as necessary

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    origin: 'https://www.ernings.online',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

app.use('/api', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
