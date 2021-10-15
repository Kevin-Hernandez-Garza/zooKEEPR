const path = require('path');
const router = require('express').Router();

// route to serve the index.html file
router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// route to serve the animals.html file
router.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// route to serve the zookeeper.html file 
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// route to serve errors if route requested doesn't exist
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;