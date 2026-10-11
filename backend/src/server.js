const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE

mongoose.connect(DB).then(() => {
    console.log('connected...')
})

app.listen(3000, () => {
    console.log('start')
})