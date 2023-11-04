
const express = require('express'); // imports the express framework
const app = express(); // inititalizes an instance of the express application to create routs and handles http requests
const fs = require('fs'); // imports the node.js file system module, used to json data from a file. 
const { join } = require('path');
const path = require('path'); // Import the 'path' module.


// Serve static files (HTML, CSS, JavaScript) from the "Client" directory.

app.use('/', express.static(path.join(__dirname, '../Client'))); 

// to Serve the index.html file. 
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Client/index.html'));
});


// Read the superhero_info.json file
const superheroInfoData = JSON.parse(
  fs.readFileSync('superhero_info.json', 'utf8') // reads the contents of the file and then parses it into a js object
);

// Define a route to get superhero information by ID
app.get('/get_superhero_info/:id', (req, res) => { // defines an http get routej. req is the request object, res is the response object
  const superheroId = req.params.id; // extracts the id parameter from the url and assigns it to superheroId
  // Find the superhero by ID
  const superhero = superheroInfoData.find( // searches heroes until it finds an id that s
    (hero) => hero.id === parseInt(superheroId)
  );
  if (!superhero) {
    return res.status(404).json({ error: 'Superhero not found' });
  }
  res.send(JSON.stringify(superhero));
});





// Define a route to get superhero information by names
app.get('/get_superhero_i/:name', (req, res) => { // defines an http get route. req is the request object, res is the response object
  const superheroName = req.params.name; 
  const superhero = superheroInfoData.find(
    (hero) => hero.name.toLowerCase() === superheroName.toLowerCase()
  );
  if (!superhero) {
    return res.status(404).json({ error: 'Superhero name not found' });
  }
  res.send(JSON.stringify(superhero));

});







//This is for question four (works for name, race and publisher)

// app.get('/get_superhero_ids_by_field/:field/:pattern/:n', (req, res) => {
//   const {field, pattern, n} = req.params;

//   const heroes = []
//   for(var hero in superheroInfoData){
//     if (hero[pattern] == field){
//       heroes.push(hero.id); 
//     }
//   }

//     // Return the first `n` IDs or all IDs if `n` is not provided
//     const results = n ? heroes.slice(0, n) : heroes;

//     res.json(results);

// });



app.get('/search_superhero_ids/:field/:pattern/:n', (req, res) => {
  const { field, pattern, n } = req.params;
  //const superheroData = isPowerField(field) ? superheroPowerData : superheroInfoData;
  var superheroData; 
  var matchingSuperheroes; 

  if (pattern == 'power'){
    superheroData = superheroPowerData; 
    matchingSuperheroes = superheroData.filter((hero) => {
      if (hero[field] && hero[field] == 'True') {
        return true;
      }
      return false;
    });
  } else {
    superheroData = superheroInfoData; 
    matchingSuperheroes = superheroData.filter((hero) => {
      if (hero[pattern] && hero[pattern].toLowerCase().includes(field.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  const results = n ? matchingSuperheroes.slice(0, n) : matchingSuperheroes;

  // If it's the power field, map the "hero_names" to "id" from the other JSON file
  if (pattern == 'power' && results.length > 0) {
    const ids = results.map((hero) => {
      const matchingHero = superheroInfoData.find((infoHero) =>
        infoHero.name.toLowerCase() === hero.hero_names.toLowerCase()
      );
      return matchingHero.id;
    });
    res.json(ids);

  } else {
    // Otherwise, return the "id" field directly
    res.json(results.map((hero) => hero.id));
  }
});












// read the powers json file
const superheroPowerData = JSON.parse(
  fs.readFileSync('superhero_powers.json', 'utf8') // reads the powers jsonfile and parses it into a js object. 
); 



// Define a route to get superhero powers by name
app.get('/get_superhero_power/:hero_names', (req, res) => { // defines an http get route. req is the request object, res is the response object
  const superheroName = req.params.hero_names; // extracts the id parameter from the url and assigns it to superheroId
  // Find the superhero by name
  const superheroPowers = superheroPowerData.find(
    (hero) => hero.hero_names === superheroName
  );
  if (!superheroPowers) {
    return res.status(404).json({ error: 'Superhero powers not found' });
  }
  res.send(JSON.stringify(superheroPowers));
});


// function to search heroes by race and put it into an array and send that. 
app.get('/get_superheroes_by_race/:race', (req, res) => {
  const raceToSearch = req.params.race;
  const matchingSuperheroes = superheroInfoData.filter(
    (hero) => hero.Race === raceToSearch
  );
  res.json(matchingSuperheroes);
});



// function to search heroes by publisher and put it into an array and send that. 
app.get('/get_superheroes_by_publisher/:publisher', (req, res) => {
  const publisherToSearch = req.params.publisher;
  const matchingSuperheroes = superheroInfoData.filter(
    (hero) => hero.Publisher === publisherToSearch
  );
  res.json(matchingSuperheroes);
});




// function to search heroes by publisher and put it into an array and send that. 
// app.get('/get_superheroes_by_power/:publisher', (req, res) => {
//   const publisherToSearch = req.params.publisher;
//   const matchingSuperheroes = superheroPowerData.filter(
//     (hero) => hero.Publisher === publisherToSearch
//   );
//   res.json(matchingSuperheroes);
// });


// Define a route to get superheroes by a specific power
app.get('/get_superheroes_by_power/:powerKey', (req, res) => {
  const powerKeyToSearch = req.params.powerKey;
  const matchingSuperheroes = superheroPowerData.filter((hero) => hero[powerKeyToSearch] === 'True');

  if (matchingSuperheroes.length === 0) {
    return res.status(404).json({ error: 'No superheroes with this power found' });
  }

  res.json(matchingSuperheroes);
});











// Define a route to get all unique superhero publishers
app.get('/get_superhero_publishers', (req, res) => {
  try {
    const uniquePublishers = getUniquePublishers(superheroInfoData);
    res.json(uniquePublishers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching unique publishers' });
  }
});

// Function to get all unique publishers from the data
function getUniquePublishers(data) {
  const uniquePublishers = [];
  data.forEach((hero) => {
    if (!uniquePublishers.includes(hero.Publisher)) {
      uniquePublishers.push(hero.Publisher);
    }
  });
  return uniquePublishers;
}





// Everything to do with lists --------------------------------------------------------------------------------


// Read the superhero_info.json file
const listData = JSON.parse(
  fs.readFileSync('lists.json', 'utf8') // reads the contents of the file and then parses it into a js object
);



// Create a new list with a given name
app.post('/create_list/:listname', (req, res) => {
  const listname = req.params.listname;
  // Check if the listname already exists
  const existingList = listData.find((list) => list.listname === listname);
  if (existingList) {
    return res.status(400).json({ error: 'List with the same name already exists.' });
  }
  // Create a new list object with an empty array of superheroes
  const newList = { listname, superheroes: [] };
  // Add the new list to the data
  listData.push(newList);
  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));

  res.json(newList);
});



// Add items to a list in the json file
app.post('/add_ids_to_list/:listname/:ids', (req, res) => {
  const {listname, ids} = req.params;
  // Check if the listname exists
  const existingList = listData.find((list) => list.listname === listname);
  if (existingList) {
    existingList["superheroes"] = ids; // set the new id's in that list
  } else {
    return res.status(400).json({ error: 'No list found' });
  }
  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(existingList);
});



// Get id's from list for a given listname
app.get('/get_ids_from_list/:listname', (req, res) => {
  const listname = req.params.listname;
  // Check if the listname exists
  const existingList = listData.find((list) => list.listname === listname);
  if (!existingList) {
    return res.status(400).json({ error: 'No list found' });
  } 
  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(existingList["superheroes"]);
});



// delete a list with a given list name
app.delete('/delete_list/:listname', (req, req) => {
  const linstname = req.params.listname; 
  const existingListIndex = listData.findIndex((list) => list.listname === listname);
  if (!existingListIndex) {
    return res.status(400).json({ error: 'No list found' });
  } 

  listData.splice(existingListIndex, 1);
  fs.writeFileSync('lists.json', JSON.stringify(listData,null,2)); 
  res.json({ message: 'List deleted successfully' });

}); 

// get a list of names, information and powers of all superheroes saved in a given list. 
 // Get id's from list for a given listname
app.get('/get_ids_from_list/:listname', (req, res) => {
  const listname = req.params.listname;
  // Check if the listname exists
  const existingList = listData.find((list) => list.listname === listname);
  if (!existingList) {
    return res.status(400).json({ error: 'No list found' });
  } 

  var superheroes = []; 
  for(var id in existingList['superheroes']){ // iterates through one list of superhero id's
    for(var heroes in superheroInfoData){ // iterates through 
      if (heroes.id === id){
  
      }
    }
    
  }

  



  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(existingList["superheroes"]);
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

