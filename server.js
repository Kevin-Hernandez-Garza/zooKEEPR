// import the file-system library to write data to to animals.json
const fs = require('fs');
const path = require('path');
const express = require('express'); // load the express module
const {animals} = require('./data/animals'); // requiring the animals data   
const PORT = process.env.PORT || 3001; // environment variable
const app = express(); // instantiating the server 


// middleware that instructs the server to make files available and not gate them behind a server endpoint
app.use(express.static('public'));
//parse incoming string or array data. mounting function to pass through, known as middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); // parse incoming JSON data

// filtering functionality through the animals, returning a new filtered array 
function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
    // saved animalsArray as filteredResults
    let filteredResults = animalsArray;
    if(query.personalityTraits) {
        // save personalityTraits as a dedicated array.
        // if personalityTraits is a string, place it into a new array and save 
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in the array
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// function that returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// createNewAnimal function 
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // "null" means we don't want to edit any or our existing data, if we did we can pass something in there. 
        // 2 is adding whitespace between the variables to make it easier to read. 
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    return animal;
}

// validating data function
function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.species !== 'string') {
        return false;
    } 
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// adding the route
app.get('/api/animals', (req,res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// adding the :id to a new route using req.params
// a param route must always come after the other GET route
app.get('/api/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// creating a POST endpoint/ POST route
app.post('/api/animals', (req,res) => {
    // set id based on what the next index of the array will be 
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect send a 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
    // add animal to json file and animals array in this function 
    const animal  = createNewAnimal(req.body, animals);
    res.json(req.body);
    }
});

// route to serve the index.html file
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// route to serve the animals.html file
app.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// route to serve the zookeeper.html file 
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// route to serve errors if route requested doesn't exist
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// make the server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});