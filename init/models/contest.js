const mongoose = require('mongoose');
const validator = require('validator')
const shortId = require('shortid')

const contestSchema = new mongoose.Schema({
       name: {
              type: String,
              require: true,
              trim: true
       },
       numberOfContestant: {
              type: Number ,
              default: 5
       },
       description: {
              type: String,
              require: true,
       },
       _Id: {
            type: String,
            default: shortId.generate

       },
       owner: {
              type: mongoose.Schema.Types.ObjectId,
              required:true,
              ref: 'House'
       }
})

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest