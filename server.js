// adding ability to rewrite the animal.json file
const fs = require('fs');
const path = require('path');


// require express.js after npm init -y to create repo
const express = require ('express');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app=express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// setting file path for static resources -- CSS JS ETC...
app.use(express.static('public/zookeepr-public'));

// filter results function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
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
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

// function to return a single animal opbject based on id
function findById(id, animalsArray) {
const result = animalsArray.filter(animal => animal.id === id)[0];
return result;
}  

function createNewAnimal(body, animalsArray) {
    console.log(body);
    // creates variable and pushes to main animal array
    const animal = body;
    animalsArray.push(animal);
    // rewrites data file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
      );
  
    // return finished code to post route for response
    return body;
  }

// validation funtion
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

// add route type
app.get('/api/animals', (req, res) => {
    // .send command -// res.send('Hello!');
    // returns all animal data -// res.json(animals);
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

app.get('/api/animals/:id', (req, res) => {
const result = findById(req.params.id, animals);
if (result) {
    res.json(result);
} else {
    // error if nothing found
    res.send(404);
}
});

// receives and tranfers to animal array
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
  });

// sending the index.html file on request
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, './public/zookeepr-public/index.html'));
});  
// sending the animals.html file on request
app.get('/animals', (req, res) => {
res.sendFile(path.join(__dirname, './public/zookeepr-public/animals.html'));
});  
// sending the zookeepers.html file on request
app.get('/zookeepers', (req, res) => {
res.sendFile(path.join(__dirname, './public/zookeepr-public/zookeepers.html'));
});  

// wildcard route -- catch all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepr-public/index.html'));
  });

  // method to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
// route for front end request
const { animals } = require('./data/animals');

// Terminal commands : ctrl+c stops the server - npm start to start back up