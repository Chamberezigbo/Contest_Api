const express = require('express');
require('./db/mongoose')
require('dotenv').config({ path: 'config/dev.env' });


const houseRouter = require('./router/house')
const contestRouter = require('./router/contest')

const app = express()
const port = process.env.PORT
app.use(express.json())

app.use(houseRouter)
app.use(contestRouter)

app.listen(port, () => {
       console.log(`server is up at port ${port} ` );
})