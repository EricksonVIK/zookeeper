// require express.js after npm init -y to create repo
const express = require ('express');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app=express();

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
// method to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
// route for front end request
const { animals } = require('./data/animals');

// Terminal commands : ctrl+c stops the server - npm start to start back up