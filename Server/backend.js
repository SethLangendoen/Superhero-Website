const DOMPurify = require('dompurify');
const express = require('express'); // imports the express framework
const app = express(); // inititalizes an instance of the express application to create routs and handles http requests
const fs = require('fs'); // imports the node.js file system module, used to json data from a file. 
const { join } = require('path');
const path = require('path'); // Import the 'path' module.
const i18n = require('i18n');
const bcrypt = require('bcrypt'); 
//const passport = require('passport'); 
const flash = require('express-flash'); 
const session = require('express-session'); 
const bodyParser = require('body-parser');
const { connectToMongoDB, closeMongoDBConnection, insertUser, updateUser, findUserByEmail, findUserByNickname, findUserByToken } = require('./db');
const { insertList, getAllLists, editList, deleteList, addRating, addReview} = require('./listDB'); 
require('dotenv').config();
const crypto = require('crypto');
const transporter = require('./emailConfig'); // to be used for email configuration. 
// allows us to access form values inside the request variable. 
app.use(flash()); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false})); 
const router = express.Router();
const cors = require('cors'); // allows cross oriting resource sharing 
app.use(cors()); // Enable CORS for all routes
var stringSimilarity = require("string-similarity");


connectToMongoDB(); // connects us to the mongodb when the server starts. 


const jwt = require('jsonwebtoken');
const { parentPort } = require('worker_threads');
app.use(express.json());


// using the secret key from an environment file for extra security. 
const jwtSecret = process.env.JWT_SECRET || 'thiscouldbethesecrettoo';


// this is how to use the middleware
//app.get('/protected', authenticateJWT, (req, res) => {

// Middleware to extract and verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log(token)
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};




var loggedInUser = {}; 

// Route to generate a JWT upon successful login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if(user){
    loggedInUser = user; 
    if (await bcrypt.compare(password, user.hashedPassword)) {
      if (user.isVerified === true){
        const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' });
        loggedInUser.token = token; // associating the signed token with the logged in user. 
        res.json({ key: 'success', token, user}); 
      } else {
        res.json({key: 'notVerified'})
      }
    } else { // password incorrect
      res.json({key: 'incorrectCredentials'})
    }
  }
  else { // email incorrect
    res.json({key: 'incorrectCredentials'})
  }
});


app.get("/getCredentials", async(req, res) => {
  res.json({key: loggedInUser}); 
})

app.post('/logout', (req, res) => {
  loggedInUser = {};
  res.json({ key: 'success', message: 'Logged out successfully' });
});



// route to change a user's password.
app.post('/changePassword', authenticateJWT, async (req, res) => {
  const { password } = req.body;
  const user = findUserByEmail(loggedInUser.email);
  // Ensure user exists before attempting to update
  if (!user) {
    return res.status(404).json({ key: 'error', message: 'User not found' });
  }
  const hashedPass = await bcrypt.hash(password, 10);
  const update = {
    $set: { hashedPassword: hashedPass },
  };
  await updateUser(user, update);
  res.json({ key: 'success', message: 'Password changed successfully' });
});




// used for the email verification token. 
const generateRandomToken = function(){
  return crypto.randomBytes(20).toString('hex');
};

app.post('/createAccount', async (req, res) => {

  const { nicknameInput , emailInput, passwordInput} = req.body;
  const user = await findUserByEmail(emailInput);
  const nick = await findUserByNickname(nicknameInput); 
  if(nick){
    res.json({key: "nickExists"}); 
  } else if(user){
    res.json({key: 'userExists'})
  } else {
    const hashedPassword = await bcrypt.hash(passwordInput, 10) // 10 describes the security intensity. 10 is quick as well. 
    const disabled = false; // the admin can disable accounts using this.
    const isAdmin = false; 
    const isVerified = false; // will be used to determine if the user's email has been verified.
    token = generateRandomToken();

      // if(findUserByEmail(email) == null){ // no user exists in the db so we insert a user.
    try{
      const result = await insertUser({
        nicknameInput,
        emailInput,
        hashedPassword,
        disabled,
        isAdmin,
        isVerified,
        token,
      });
      console.log(result); 
    }catch(e){

    }

    try{
    // setting up the mailing options. 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailInput,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: http://localhost:8080/verify/${token}`,
    }
    await transporter.sendMail(mailOptions);

    }catch(e){

    }

    res.json({key: 'success'});
  }

})


// this will need middleware. 
// lists will contain a name, description, hero collection, visibility flag of public or private (defualt private), lastModified



app.post('/createList', authenticateJWT, async (req, res) => {
  const {listName, listDesc, heroCollection, createdBy} = req.body; 
  var currentDateAndTime = new Date();
  const visibility = 'private'; 
  const ratings = []; 
  const comments = []; 

  const allListsArray = Array.from(await getAllLists()); // converting to an array to be iterated over. 
  const sameName = allListsArray.find((list) => ((list.listName === listName) && (list.createdBy === createdBy)))

  if(sameName){ // sameName tells us that it found a list with a matching list name. 
    res.json({key: 'sameName'}); 
  } else { // no lists were found with this name. We can proceedf to making it. 

    try{
      const result = await insertList({
        listName,
        listDesc,
        createdBy,
        heroCollection,
        visibility,
        currentDateAndTime,
        ratings,
        comments,
      });
    }catch(e){

    }
    res.json({key: 'success'});
  }

})


  // Editing lists that you have created: 
  /* 
  ### Get the current list that is clicked on when the edit button is pressed. (using the currently logged in user's nickname and the listname. )
  Edit Dislay: 
  - name input, description input, hero input, publicity input, save button. 
  - Upon saving, the previous list is updated appropriately. (inputs must all be there)
  
  */ 


  

  app.post('/editExistingList', async (req, res) => {
    const {newListName, newListDesc, newHeroCollection, newPublicity, createdBy, prevListName} = req.body; 

    try{
      editList(newListName, newListDesc, newHeroCollection, newPublicity, createdBy, prevListName); 
      res.json({key: "success"}); 
    } catch {
      res.json({key: "failed to edit list"}); 
    }

  })



app.post('/addReview', authenticateJWT, async (req, res) => {
  const {comments, listName, createdBy} = req.body; 
  try{
    addReview(comments, listName, createdBy); 
    res.json({key: 'success'}); 
  } catch (e){
    console.log("Error adding rating: " + e)
  }
})




app.post('/addRating', authenticateJWT, async (req, res) => {
  const {rating, listName, createdBy} = req.body; 
  try{
    addRating(rating, listName, createdBy); 
    res.json({key: 'success'}); 
  } catch (e){
    console.log("Error adding rating: " + e)
  }

})





// used to get all the lists. // THIS NEEDS TO BE UPDATED SO THAT IT ONLY DISPLAYS WHEN PUBLIC IS CHECKED
app.post('/displayLists', async (req, res) => {
  try {
    const lists = await getAllLists();
    // this holds reference to all the lists with visibility of public and sorts them. 
    const publicLists = lists.filter((list) => list.visibility === 'public').sort((a, b) => new Date(b.currentDateAndTime) - new Date(a.currentDateAndTime)); 
    res.json({ data: publicLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});




// used to get all the lists.
app.post('/displayPersonalLists', async (req, res) => {

  const {createdBy} = req.body; 

  try {
    const lists = await getAllLists();
    const personalLists = lists.filter((list) => list.createdBy === createdBy); // filtering all the lists so that it only displays the lists with the matching logged in user's name. 

    res.json({ data: personalLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }

});




// used to get all the lists.
app.post('/deleteList', async (req, res) => {

  const {listName, createdBy} = req.body; 

  try {
    deleteList(listName, createdBy); 
    res.json({ key: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete list' });
    console.log('failed to delete list'); 
  }

});










// this route listens for when a user clicks on the email verifictaion link. 
app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    // Find the user by the verification token
    const user = await findUserByToken(token); 

    // return res.status(200).json({ message: await updateUserByEmail(user.email, update)});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const update = {
      $set: {isVerified: true}
    }
    try {
      await updateUser(user, update);
      return res.status(200).json({ message: 'Email verification successful' });
    } catch (updateError) {
      console.error('Error updating user:', updateError);
      return res.status(500).json({ message: 'Failed to update user status' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








// read the powers json file
const superheroPowerData = JSON.parse(
  fs.readFileSync('superhero_powers.json', 'utf8') // reads the powers jsonfile and parses it into a js object. 
); 

// Read the superhero_info.json file
const superheroInfoData = JSON.parse(
  fs.readFileSync('superhero_info.json', 'utf8') // reads the contents of the file and then parses it into a js object
);



// route for searching heroes, and including the heroes that only match all filters given in name, race publisher and power
app.post('/heroSearch', (req, res) => {
const {name, race, publisher, power} = req.body; 

  const foundHeroesByName = superheroInfoData.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase())); 
  const foundHeroesByRace = superheroInfoData.filter((hero) => hero.Race.toLowerCase().includes(race.toLowerCase())); 
  const foundHeroesByPublisher = superheroInfoData.filter((hero) => hero.Publisher.toLowerCase().includes(publisher.toLowerCase())); 
  const powers = superheroPowerData.filter((powers) => (powers[power] === "True")); 

  const heroNamesByPower = new Set();
  for (const powerItem of powers) {
    const heroesWithPower = superheroInfoData.filter((hero) => hero.name === powerItem.hero_names);
    heroesWithPower.forEach((hero) => heroNamesByPower.add(hero));
  }

  const foundHeroesByPower = Array.from(heroNamesByPower);

  const nonNullLists = [foundHeroesByName, foundHeroesByRace, foundHeroesByPublisher, foundHeroesByPower];
  const filteredLists = nonNullLists.filter((list) => list && list.length > 0);
  if (filteredLists.length === 0) {
    res.json([]);
    return;
  }

  const resultHeroes = filteredLists[0].filter((hero) => {
    return filteredLists.every((list) => list.includes(hero));
  });

  res.json(resultHeroes)

})


// this function needs to take a list of names and return a list of the corresponding heroes. 

app.post('/getHeroesByList', (req, res) => {
  const { heroList } = req.body;
  const splitHeroList = heroList.split(',');
  const finalHeroList = [];

  splitHeroList.forEach((heroName) => {
    const foundHero = superheroInfoData.find((jsonHero) =>
      jsonHero.name.toLowerCase() === heroName.trim().toLowerCase()
    );

    if (foundHero) {
      finalHeroList.push(foundHero);
    }
  });
  res.json({ key: finalHeroList });
});


// Define a route to get superhero information by ID
app.get('/api/open/get_superhero_info/:id', (req, res) => { // defines an http get routej. req is the request object, res is the response object
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


















// Close MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit();
});


// previous application --------------------------------------------------------------------------------------------


// used for multiple language compatibility
// Initialize the i18n library
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/locales',
});
// Custom middleware for language detection
app.use((req, res, next) => {
  const userLanguage = req.query.lang || 'en'; // Detect language from URL parameter or use a default
  i18n.setLocale(req, userLanguage);
  next();
});



// Serve static files (HTML, CSS, JavaScript) from the "Client" directory.
app.use('/', express.static(path.join(__dirname, '../Client'))); 
// to Serve the index.html file. 
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Client/index.html'));
});





// Define a route to get superhero information by names
app.get('/api/open/get_superhero_i/:name', (req, res) => { // defines an http get route. req is the request object, res is the response object
  const superheroName = req.params.name; 
  const superhero = superheroInfoData.find(
    (hero) => hero.name.toLowerCase() === superheroName.toLowerCase()
  );
  if (!superhero) {
    return res.status(404).json({ error: 'Superhero name not found' });
  }
  res.send(JSON.stringify(superhero));
});

// return a list of id's based on the user's search field, pattern an n searches
app.get('/api/open/search_superhero_ids/:field/:pattern/:n', (req, res) => {
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





// Define a route to get all unique superhero publishers:  
app.get('/api/open/get_superhero_publishers', (req, res) => {
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
app.post('/api/open/create_list/:listname', (req, res) => {
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
app.get('/api/open/add_ids_to_list/:listname/:ids', (req, res) => {
  const {listname, ids} = req.params;
  // Check if the listname exists
  const idList = ids.split(','); 
  const existingList = listData.find((list) => list.listname === listname);
  if (existingList) {
    existingList.superheroes = idList; // set the new id's in that list

  } else {
    return res.status(400).json({ error: 'No list found' });
  }

  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(existingList.superheroes);
});


// for display list
// Get id's from list for a given listname
app.get('/api/open/get_ids_from_list/:listname', (req, res) => {
  const listname = req.params.listname;
  // Check if the listname exists
  const existingList = listData.find((list) => list.listname === listname);
  if (!existingList) {
    return res.status(400).json({ error: 'No list found' });
  } 
  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(existingList.superheroes);
});


// delete a list
app.delete('/api/open/delete_list/:listname', (req, res) => {
  const listname = req.params.listname; 
  const existingListIndex = listData.findIndex((list) => list.listname === listname);
  if (existingListIndex === -1) {
    return res.status(400).json({ error: 'No list found' });
  } else {
    listData.splice(existingListIndex, 1);
    fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2)); 
    res.json({ message: 'List deleted successfully' });
  }
});
 

// Get list name from lists.json
app.get('/api/open/get_ids_from_list/', (req, res) => {
  // Check if the listname exists
  const listNames = []
  for (var item of listData){
    listNames.push(item.listname); 
  }
  // Save the updated data to the lists.json file
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(listNames);
});


// get a list of superheroes containing both their information and their powers from some listname. 
app.get('/api/open/get_info_from_list/:listname', (req, res) => {
  const listname = req.params.listname;
  // Check if the listname exists
  const existingList = listData.find((list) => list.listname === listname);
  if (!existingList) {
    return res.status(400).json({ error: 'No list found' });
  } 

  var superheroesList = []; 
  for (const id of existingList.superheroes) {
    const heroName = getHeroNameById(id);
    if (heroName) {
      const heroInfo = superheroInfoData.find((hero) => hero.id === parseInt(id));
      var heroInfoList = []; 
      if (heroInfo){
        heroInfoList.push(heroInfo.name); 
        heroInfoList.push(heroInfo.Gender); 
        heroInfoList.push(heroInfo['Eye color']); 
        heroInfoList.push(heroInfo.Race); 
        heroInfoList.push(heroInfo['Hair color']); 
        heroInfoList.push(heroInfo.Height); 
        heroInfoList.push(heroInfo.Publisher); 
        heroInfoList.push(heroInfo['Skin color']); 
        heroInfoList.push(heroInfo.Alignment); 
        heroInfoList.push(heroInfo.Weight); 
      }

      const heroPowers = superheroPowerData.find((hero) => hero.hero_names.toLowerCase() === heroInfo.name.toLowerCase());
      var heroPowerList = []; 
      if(heroPowers){
        Object.entries(heroPowers).map(([power, value]) => {
          if (value === "True") {
            heroPowerList.push(power);
          }
        })
      }

      superheroesList.push([heroInfoList, heroPowerList]);
    }
  }
  fs.writeFileSync('lists.json', JSON.stringify(listData, null, 2));
  res.json(superheroesList);
});

function getHeroNameById(id) {
  const hero = superheroInfoData.find((hero) => hero.id === parseInt(id));
  return hero ? hero.name : null;
}



// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

