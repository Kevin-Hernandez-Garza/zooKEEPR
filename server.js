// import the file-system library to write data to to animals.json
const fs = require('fs');
const path = require('path');
const express = require('express'); // load the express module
const {animals} = require('./data/animals'); // requiring the animals data   
const PORT = process.env.PORT || 3001; // environment variable
const app = express(); // instantiating the server 
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// middleware that instructs the server to make files available and not gate them behind a server endpoint
app.use(express.static('public'));
//parse incoming string or array data. mounting function to pass through, known as middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // parse incoming JSON data

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// make the server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});