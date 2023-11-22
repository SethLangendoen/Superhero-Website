// // used to configure local authentication. 
// const localStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')



// function initialize(passport, findUserByEmail){
// 	const authenticateUser = async (email, password, done) => {
// 		const user = findUserByEmail(email) // will be used to get a reference to our user. 
// 		if (user == null){ // cannot find user
// 			return done(null, false, {message: "No user with that email"})
// 		}
// 		try {
// 			if (await bcrypt.compare(password, user.password)){ // found authenticated user. 
// 				return done(null, user) // returns the appropriate user if the passwords match. 
// 			} else {
// 				return done(null, false, {message: 'password incorrect'}) // return a failure message. (no user found)
// 			}
// 		} catch (error) {
// 			return done(error); 
// 		}
// 	}

// 	// calling the authenticateUser function using the inputted email and password from the user. 
// 	passport.use(new localStrategy({usernameField: "email", passwordField: "password"}, authenticateUser))
// 	// serializing a user converts the user's data into a format that can be stored and later used in the same session. 
// 	passport.serializeUser((user,done) => done(null, user.email))
// 	// deserializing a user involves finding the user based off of the id we used to serialize it so that we can use the user's data. 
// 	passport.deserializeUser((email,done) => { done(null, findUserByEmail(email))})

// }


// module.exports = initialize; 