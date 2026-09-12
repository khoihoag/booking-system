const express = require('express')
const morgan = require('morgan')

const app = express()

const fieldRouter = require('./routes/PitchRouter')
const timeSlotRouter = require('./routes/TimeSlotRouter')
const globaErrorlHandler = require('./controller/ErrorController')
const AppError = require('./utils')


app.use(express.json())
app.use(morgan('dev'))

app.use('/api/pitch', fieldRouter)
app.use('/api/timeSlot', timeSlotRouter)

app.all('*', (err, req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} in this server`, 404))
})

app.use(globalHandler)

module.exports = app