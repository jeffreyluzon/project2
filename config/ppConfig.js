const passport = require('passport')
let db = require('../models')
const LocalStrategy = require('passport-local')


// ----------------------------> SERIALIZATION SET UP <----------------------------

// tell the passport to serialize the user using the id
// by passing it into the doneCallback
passport.serializeUser((user, doneCallback) => {
    console.log("serializing user...")
    doneCallback(null, user.id)
})

// tells passport how to deserialize the user now by looking it up
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then(foundUser => {
        console.log("deserializing user....")
        doneCallback(null, foundUser)
    })
    .catch((err)=>{
        console.log("error deserializing user")
    })
})
// ----------------------------> STRATEGY SET UP <----------------------------\
const findAndLogInUser = (email, password, doneCallback) =>{
    db.user.findOne({where:{email: email}}) // go check for a user in the db with that email
    .then(async foundUser=>{
        let match
        if(foundUser){
            match = await foundUser.validPassword(password)
        }
        if(!foundUser || !match){ // something funky about the user
            console.log('password was NOT validated i.e. match is false')
            return doneCallback(null, false) // send back "false"
        } else { // user was legit
            return doneCallback(null, foundUser) // send the found user object
        }
    })
    .catch(err=>doneCallback(err)) // doneCallback takes two params: error, userToBeLoggedIn
}

const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)

module.exports = passport