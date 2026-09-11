const express = require('express')
const morgan = require('morgan')

const app = express()

const fieldRouter = require('./routes/PitchRouter')
const timeSlotRouter = require('./routes/TimeSlotRouter')


app.use(express.json())
app.use(morgan('dev'))

app.use('/api/pitch', fieldRouter)
app.use('/api/timeSlot', timeSlotRouter)


module.exports = app