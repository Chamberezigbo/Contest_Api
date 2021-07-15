const mongoose = require('mongoose');
require('dotenv').config({ path: 'config/dev.env' });

mongoose.connect(process.env.MONGODB_URL, {
       useCreateIndex: true,
       useCreateIndex: true,
       useFindAndModify: false,
       useNewUrlParser: true,
       useUnifiedTopology: true
},() => {
       console.log(' connected to the mongodb ');
})