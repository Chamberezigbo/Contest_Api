const express = require('express');

const Contest = require('../models/contest')
const auth = require('../middleware/auth');

const router = new express.Router()


router.post('/contests', auth , async (req,res) => {
       const contest = new Contest({
              ...req.body,
              owner: req.house._id
       })

       try {
              await contest.save()
              res.status(201).send(contest)
       } catch (e) {
              res.status(400).send(e)
       }
})

router.get('/contest/:id', auth , async (req, res) => {
       const _id = req.params.id 
       
       try {
              const contest = await Contest.findOne({_Id: _id})
              
              if (!contest) {
                     return res.status(404).send()
              }
              res.send(contest)
       } catch (e) {
              res.status(500).send()
       }
})

router.get('/contest', auth , async (req,res) => {
       
       const match = {}
       const sort = {}

       if (req.query.all) {
              match.all = req.query.all == "true"
       }

       try {
            await req.house.populate({
              path: 'contests',
              match
            }).execPopulate()
            res.send(req.house.contests)  
       } catch (e) {
              res.status(500).send()
       }

})

router.patch('/contest/:id', auth , async (req,res) => {
       const updates = Object.keys(req.body)
       const allowedUpdate = ['description','name','numberOfContestant']
       isValidOperation = updates.every((update) => allowedUpdate.includes(update))

       if (!isValidOperation) {
              return res.status(400).send({ error: 'Invalid updates!'})
       }

       try {
              const contest = await Contest.findOne({_Id: req.params.id})

              if (!contest) {
                     return res.status(404).send()
              }
              updates.forEach((update) => contest[update] = req.body[update])
              await contest.save()
              res.send(contest)

       } catch (e) {
              res.status(400).send(e)
       }
})

module.exports = router