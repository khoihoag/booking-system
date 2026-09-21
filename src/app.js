const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const app = express()

const fieldRouter = require('./routes/PitchRouter')
const timeSlotRouter = require('./routes/TimeSlotRouter')
const userRouter = require('./routes/UserRouter')
const globalErrorlHandler = require('./controller/ErrorController')
const AppError = require('./utils/AppError')


app.use(helmet())
app.use(express.json())

app.use(mongoSanitize())
app.use(xss())


app.use(morgan('dev'))

const limiter = rateLimit({
    // Mỗi IP chỉ được phép gửi tối đa max request trong khoảng thời gian windowMs
    max: 50,
    windowMs: 60*60*1000,
    message: "Too many request form this IP, please try again in an hour!"
})

app.use('/api', limiter)

app.use('/api/pitch', fieldRouter)
app.use('/api/timeSlot', timeSlotRouter)
app.use('/api/user', userRouter)



app.all('/{*splat}', (err, req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} in this server`, 404))
})

app.use(globalErrorlHandler)

module.exports = app