const { response } = require('express')
let express = require('express')
let db = require('../models')
let router = express.Router()
const axios = require('axios')
const { post, route } = require('./auth')
const comment = require('../models/comment')
const isLoggedIn = require('../middleware/isLoggedIn')

// show all the bounties pages
router.get('/', (req, res) =>{
    axios.get(`https://api.fbi.gov/wanted/v1/list`)
    .then(function (response) {
        // handle success
        // response.data.items[0]
        // console.log(response.data.items[1]);
        res.render('bounty/index', {bounties: response.data.items})
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
})

//show one bounty with comments and favorite button
router.get('/:id', (req,res) =>{
    // console.log('get route hit')
    db.comment.findAll({
        where: {
            bountyId: req.params.id
        }
    }).then(comments => {
        axios.get(`https://api.fbi.gov/@wanted-person/${req.params.id}`)
        .then(function (response) {
            console.log(response)
            // handle success
            // response.data.items[0]
            // console.log(response.data.items[0]);
            res.render('bounty/showOne', {bounty: response.data, comments: comments})
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    }).catch(error =>{
        res.send(error)
    })
})

// router.post('/:id', (req,res) =>{

// })



router.post('/addcomment', (req, res) =>{
    console.log(req.body)
    db.comment.create({
        bountyId: req.body.apiId,
        userId: req.user.id,
        comment: req.body.comment
      }).then(comment => {
        // res.send(comment)
        console.log(comment)
        res.redirect(`/bounty/${comment.bountyId}`)
    })
})

router.put('/:id', (req, res) =>{
    db.comment.update({
        comment: req.body.comment
    },{
        where: {
            id: req.params.id
        }
    }).then(comment =>{
        res.redirect('/')
    }).catch(error =>{
        console.log(error)
    })
})

router.delete('/:id', (req,res)=>{
    console.log(req.body)
    db.comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(comment =>{
        console.log(comment)
        // process.exit()
        res.redirect('/')
    })
    .catch(error =>{
        console.log(error)
    })
})

// routes for saved bounties 
router.get('/savedbounties', (req, res) =>{
    res.render('bounty/savedBounties')
})

router.post('/bounty/:id', isLoggedIn, (req, res)=>{
    console.log('jeffrey', req.body.uId)
    db.bounty.findOrCreate({
        where: {
            uId: req.body.uId
        }
    }).then(([foundBounty, wasCreated]) => {
        db.user.findOne({
            where: {
                id: req.user.id
            }
        })
    }).then(user =>{
        user.addBounty(foundBounty).then(relationshipinfo =>{
            res.redirect('bounty/savedBounties')
        })
    }).catch(error =>{res.send(error)})
})









module.exports = router