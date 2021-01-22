require('dotenv').config() // configure environment variable
let express = require('express')
let ejsLayouts = require('express-ejs-layouts')
let app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')




// let db = require('./models')


// enable to have a layout.ejs
app.set('view engine', 'ejs')

// enable to grab the form content
app.use(express.urlencoded({ extended: false }))
// enable layout
app.use(ejsLayouts)
// use the file prom public folder
app.use(express.static(__dirname + '/public/'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

//passport iddleware
app.use(passport.initialize())
app.use(passport.session())

//flash mid ware
app.use(flash())

// custom mid ware
app.use((req, res, next)=>{
    res.locals.alerts = req.flash()
    res.locals.currentUser =req.user
    next()
})
app.use('/auth', require('./controllers/auth'))

app.get('/', (req, res) => {
    res.render('main/home')
})


app.get('/profile', isLoggedIn, (req, res) => {
    res.render('main/profile')
})


app.get('*', (req, res) => {
    res.render('main/404')
})


app.listen(process.env.PORT, () =>{
  console.log(`we are on port ${process.env.PORT}`)
})