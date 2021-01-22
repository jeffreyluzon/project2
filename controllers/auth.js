let express = require('express')
let db = require('../models')
let router = express.Router()
const passport = require('../config/ppConfig.js')


router.get('/signup', (req, res) =>{
    res.render('auth/signup.ejs')
})

router.post('/signup', (req, res) =>{
    // find or create new user
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([user, wasCreated])=>{
        if(wasCreated){
        passport.authenticate('local', {
            successRedirect: '/',
            successFlash: 'accoutn create and user logged in'
        })(req, res)
            // res.send(`created a new user profile for ${user.email}`)
        } else {
            req.flash('error', 'account asoociate with that email already exist')
            res.redirect('/auth/login')
        }
    })
    .catch(err=> {
        req.flash('error', err.message)
        res.redirect('/auth/signup')
    })
})

router.get('/login', (req, res) =>{
    res.render('auth/login.ejs')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    successFlash: 'you are now logged in',
    failureFlash: 'invalid email or password'
}))

router.get('/logout', (req, res) =>{
    req.logout()
    res.redirect('/')
})



module.exports = router