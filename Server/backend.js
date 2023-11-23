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
const { connectToMongoDB, closeMongoDBConnection, insertUser, updateUser, findUserByEmail } = require('./db');
require('dotenv').config();
const crypto = require('crypto');
const transporter = require('./emailConfig'); // to be used for email configuration. 
// allows us to access form values inside the request variable. 
app.use(flash()); 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false})); 



// jwt tutorial---------------------------------

const jwt = require('jsonwebtoken')
app.use(express.json())


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
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

// creating an email saved variable to be used later. 
emailSaved= ''; 

// Route to generate a JWT upon successful login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  emailSaved = email; 
  if (user && await bcrypt.compare(password, user.hashedPassword)) {
    const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.redirect('/Index.html'); 
  } else {
    res.redirect('/login.html'); 
    //res.status(401).json({ message: 'Invalid credentials' });
  }
});



app.get('/getCredentials', authenticateJWT, async (req,res) => {
  const user = await findUserByEmail(emailUsed); 
  if (user){
    res(user); 
  } else {
    res.status(401).json({ message: 'No user found'});
  }
})





// used for the email verification token. 
const generateRandomToken = function(){
  return crypto.randomBytes(20).toString('hex');
};

app.post('/createAccount', async (req, res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 describes the security intensity. 10 is quick as well.  
    const { nickname, email} = req.body;
    disabled = false; // the admin can disable accounts using this. 
    isVerified = false; // will be used to determine if the user's email has been verified. 
    token = generateRandomToken();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: http://localhost:3000/${token}`,
    }
  
      // try {
      //   const info = await transporter.sendMail(mailOptions);
      //   console.log('Email sent:', info.response);
      // } catch (error) {
      //   console.error('Email sending failed:', error);
      // }

      // sending the verification email using their email and token
      // await sendVerificationEmail(email, token); 
      await transporter.sendMail(mailOptions); 


    // if(findUserByEmail(email) == null){ // no user exists in the db so we insert a user. 
    const result = await insertUser({
      nickname,
      email,
      hashedPassword,
      disabled,
      isVerified, 
      token
    });
    //   res.status(201).json({ message: 'Client created successfully' });
    // } else { // a user with that email already exists in the db
    //   res.status(201).json({ message: 'Client already exists' });
    // }

    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: 'Email Verification',
    //     text: `Click the following link to verify your email: http://localhost:3000/${token}`,
    //   }
    
    // // try {
    // //   const info = await transporter.sendMail(mailOptions);
    // //   console.log('Email sent:', info.response);
    // // } catch (error) {
    // //   console.error('Email sending failed:', error);
    // // }

    // // sending the verification email using their email and token
    // // await sendVerificationEmail(email, token); 
    // await transporter.sendMail(mailOptions); 
    // Use the insertUser function from the db module to insert a client document
  }catch (error) {
    //YOU SHOULD TALK TO A TA ABOUT THIS!
    // I cannot have both of these calls here. 
    res.status(500).json({ error: 'Internal server error', details: error.message });
    //res.redirect("/createAccount.html"); 
    // for some reason I am catching an error but I am successfully creating an account. 
  }
})

























// Everything to do with mongodb user management --------------------------------------------------------------------------------


connectToMongoDB(); // connects us to the mongodb when the server starts. 



// route to update a client's information. // look at this later 
app.put('/update-client/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const { newAttribute } = req.body;

    // Use the updateUser function from the db module to update a client document
    const result = await updateUser({ _id: clientId }, { $set: { "attributes.newAttribute": newAttribute } });

    console.log('Client updated:', result);

    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});










// Close MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit();
});


// The end of mongodb --------------------------------------------------------------------------------------------


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



// Read the superhero_info.json file
const superheroInfoData = JSON.parse(
  fs.readFileSync('superhero_info.json', 'utf8') // reads the contents of the file and then parses it into a js object
);

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


// read the powers json file
const superheroPowerData = JSON.parse(
  fs.readFileSync('superhero_powers.json', 'utf8') // reads the powers jsonfile and parses it into a js object. 
); 



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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

