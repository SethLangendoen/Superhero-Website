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
const { connectToMongoDB, closeMongoDBConnection, insertUser, updateUser, findUserByEmail, findUserByNickname, findUserByToken, getAllUsers, updateUserPrivilages } = require('./db');
const { insertList, getAllLists, editList, deleteList, addRating, addReview, hideComment } = require('./listDB'); 
const { insertPolicy, editPolicy, getPolicies} = require('./policiesDB'); 
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
const { application } = require('express');
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

  if(user.disabled){
    res.json({key: 'disabled'}); 
    return
  }

  
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


// route that sets the administrator privilages. 
// figure out authenticateJWT
app.post('/setAdminPrivilage', async (req, res) => {
  const {user, isAdmin} = req.body; 
  const update = {
    $set: { isAdmin: isAdmin },
  };
  await updateUserPrivilages(user.nicknameInput, update); 
  res.json({key: "success"}); 
})


app.post('/setActivation', async (req, res) => {
  const { user, disabled } = req.body;

  const update = {
    $set: { disabled: disabled },
  };
  await updateUserPrivilages(user.nicknameInput, update);
  res.json({ key: "success" });
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
    }catch(e){

    }

    try{
    // setting up the mailing options. 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailInput,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: http://ec2-52-90-18-10.compute-1.amazonaws.com:8080/verify/${token}`,
    }
    await transporter.sendMail(mailOptions);

    }catch(e){

    }

    res.json({key: 'success'});
  }

})


// this will need middleware. 
// lists will contain a name, description, hero collection, visibility flag of public or private (defualt private), lastModified


app.post('/getUsers', async (req, res) => {
  const {adminInput} = req.body; 
  const searchedUsers = await getAllUsers(adminInput); 
  try{
    res.json({key: searchedUsers}); 
  } catch (e){
    console.log('failed to return searched Users' + (e)); 
  }

})





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


app.post('/displayPolicies', async (req,res) => {

  try{
    const policies = await getPolicies(); 
    console.log('These are the policies: ' + policies); 
    res.json({key: policies}); 
  } catch {
    res.json({key: "failed to edit list"}); 
  }

})



app.post('/insertPolicy', async (req,res) => {
  const {policyName, policyText} = req.body; 
  try{
    await insertPolicy(policyName, policyText); 
    res.json({key: "success"}); 
    console.log('Inserted Policy!'); 
  } catch {
    res.json({key: "failed to insert policy "}); 
  }
})



app.post('/editPolicy', async (req,res) => {
  const {policyName, policyText, prevPolicyName} = req.body; 
  try{
    editPolicy(policyName, policyText, prevPolicyName); 
    res.json({key: "success"}); 
  } catch {
    res.json({key: "failed to edit list"}); 
  }
})




app.post('/hideComment', async (req, res) => {
  const {list, comment, isHidden} = req.body; 
  console.log('/hideComment' + isHidden); 
  try{
    hideComment(list, comment, isHidden); 
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






// const listData = JSON.parse(
//   fs.readFileSync('./lists.json', 'utf8') // reads the contents of the file and then parses it into a js object
// );

// read the powers json file
const superheroPowerData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'superhero_powers.json'), 'utf8')
); 

// Read the superhero_info.json file
const superheroInfoData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'superhero_info.json'), 'utf8') // reads the contents of the file and then parses it into a js object
);

// lisData

const powersAttributesList = [
  "Agility",
  "Accelerated Healing",
  "Lantern Power Ring",
  "Dimensional Awareness",
  "Cold Resistance",
  "Durability",
  "Stealth",
  "Energy Absorption",
  "Flight",
  "Danger Sense",
  "Underwater breathing",
  "Marksmanship",
  "Weapons Master",
  "Power Augmentation",
  "Animal Attributes",
  "Longevity",
  "Intelligence",
  "Super Strength",
  "Cryokinesis",
  "Telepathy",
  "Energy Armor",
  "Energy Blasts",
  "Duplication",
  "Size Changing",
  "Density Control",
  "Stamina",
  "Astral Travel",
  "Audio Control",
  "Dexterity",
  "Omnitrix",
  "Super Speed",
  "Possession",
  "Animal Oriented Powers",
  "Weapon-based Powers",
  "Electrokinesis",
  "Darkforce Manipulation",
  "Death Touch",
  "Teleportation",
  "Enhanced Senses",
  // ... (remaining attributes)
];

const allRacesSet = new Set(superheroInfoData.map(hero => hero.Race));
const allRacesArray = Array.from(allRacesSet);

const allPublishersSet = new Set(superheroInfoData.map(hero => hero.Publisher));
const allPublishersArray = Array.from(allPublishersSet);

// route for searching heroes, and including the heroes that only match all filters given in name, race publisher and power

app.post('/heroSearch', (req, res) => {
  const { name, race, publisher, power } = req.body;


  const matchedPower = stringSimilarity.findBestMatch(power, powersAttributesList);
  var bestMatchedWord = matchedPower.bestMatch.target; 
  console.log(bestMatchedWord); 
  if(power == ''){
    bestMatchedWord = power; 
  }


  const matchedRace = stringSimilarity.findBestMatch(race,allRacesArray); 
  var bestMatchedRace = matchedRace.bestMatch.target; 
  console.log(bestMatchedRace); 
  if(race == ''){
    bestMatchedRace = race; 
  }


  const matchedPublisher = stringSimilarity.findBestMatch(publisher,allPublishersArray); 
  var bestMatchedPublisher = matchedPublisher.bestMatch.target; 
  console.log(bestMatchedPublisher); 

  if(publisher == ''){ 
    bestMatchedPublisher = publisher; 
  }




  const foundHeroesByName = superheroInfoData.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase()));
  const foundHeroesByRace = superheroInfoData.filter((hero) => hero.Race.toLowerCase().includes(bestMatchedRace.toLowerCase()));
  const foundHeroesByPublisher = superheroInfoData.filter((hero) => hero.Publisher.toLowerCase().includes(bestMatchedPublisher.toLowerCase()));
  const powers = superheroPowerData.filter((powers) => powers[bestMatchedWord] === "True");


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

  res.json(resultHeroes);
});








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




// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

