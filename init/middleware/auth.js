const jwt = require('jsonwebtoken');
const House = require('../models/house');

const auth = async (req,res,next) => {

       try {
              const token = req.header('Authorization').replace('Bearer ','')
              const decoded = jwt.verify(token, process.env.JWT_SECRET)
              const house = await House.findOne({_id: decoded._id, 'tokens.token': token }) 
       
              if (!house) {
                     throw new Error()
              }
       
              req.token = token 
              req.house = house 
              next()
       } catch (e){
              res.status(401).send({ error: 'please authenticate'})

       }


}

module.exports = auth