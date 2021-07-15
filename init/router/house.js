const express = require('express');


const House = require('../models/house')
const auth = require('../middleware/auth')




const router = new express.Router()

router.post('/house', async (req,res) => {
       const house = new House(req.body);

       try {
              await house.save()
              const token = await house.generateAuthToken()
              res.status(201).send({ house, token})
       } catch (e) {
        res.status(400).send(e)      
       }
})

router.post('/house/login', async (req,res) => {
       try {
              const house = await House.findByCredentials( req.body.email, req.body.password)
              const token = await house.generateAuthToken()
              res.send({ house, token })
       } catch (e) {
             res.status(400).send(e) 
       }
})

router.post('/house/logout', auth, async (req,res) => {
       try {
              req.house.tokens = []
              await req.house.save()
              res.send()
       } catch (e) {
              res.status(500).send()
       }
})

router.get('/house/me', auth , async (req,res) => {
       res.send(req.house)
})

router.patch('/house/me', auth, async (req,res) => {
       const updates = Object.keys(req.body)
       const allowedUpdates = ['name', 'email', 'password', 'description']
       const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
       if (!isValidOperation) {
              return res.status(400).send({ error: 'invalid update! '})
       }

       try {
              updates.forEach((update) => req.house[update] = req.body[update])
              await req.house.save()
              res.send(req.house)
       } catch (e) {
              res.status(400).send(e)
       }
})

router.delete('/house/me', auth , async (req,res) => {
       try {
              await req.house.remove()
              res.send(req.house)
       } catch (e) {
           res.status(500).send()   
       }
})
module.exports = router