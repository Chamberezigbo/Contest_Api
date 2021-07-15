const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const shortId = require('shortid')

const Contest = require('./contest')


const houseSchema = new mongoose.Schema({
       name: {
            type: String,
            required: true,
            trim: true  
       },
       email: {
              type: String,
              required: true ,
              unique: true,
              trim: true,
              lowercase: true,
              validate(value){
                     if (!validator.isEmail(value)) {
                            throw new Error(' Email is not valid')
                     }
              }
       },
       password: {
              type: String,
              required: true ,
              minlength: 7,
              trim: true,
              validate(value){
                     if (value.toLowerCase().includes('password') ) {
                            throw new Error('password cannot contain password') 
                     }
              }

       },
       description: {
              type: String,
              require: true,
              minlength: 5,
       },
       tokens: [{
              token: {
                     type: String,
                     required: true
              }
       }],
       _Id: {
              type: String,
              default: shortId.generate
  
         },
})

houseSchema.virtual('contests', {
       ref: 'Contest',
       localField: '_id',
       foreignField: 'owner'
})

// hash the password before saving house or edit //
houseSchema.pre('save', async function (next) {
       if (this.isModified('password')) {
              this.password = await bcrypt.hash(this.password, 8) 
       }
       next()
})

houseSchema.statics.findByCredentials = async (email,password) => {
       const house = await House.findOne({ email });
       
       if (!house) {
              throw new Error('Invalid Email')
       }

       const isMatch = await bcrypt.compare(password, house.password)

       if (!isMatch) {
              throw new Error('check your details')
       }

       return house
}

houseSchema.methods.generateAuthToken = async function () {
       const house = this 
       const token = jwt.sign({_id: house._id.toString()}, process.env.JWT_SECRET)

       house.tokens = house.tokens.concat({ token })
       await house.save()

       return token
}

houseSchema.methods.toJSON = function () {
       const houseObject = this.toObject()
       
       delete houseObject.password
       delete houseObject.tokens

       return houseObject
}

const House = mongoose.model('House', houseSchema)

module.exports = House