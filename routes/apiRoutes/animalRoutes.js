// importing functions
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
// importing animals data object
const {animals} = require('../../data/animals');

// Router instance
const router = require('express').Router();

// adding the route
router.get('/animals', (req,res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// adding the :id to a new route using req.params
// a param route must always come after the other GET route
router.get('/animals/:id', (req,res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// creating a POST endpoint/ POST route
router.post('/animals', (req,res) => {
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

module.exports = router;