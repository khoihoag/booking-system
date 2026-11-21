const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bookingLifecycleService = require('./service/BookingLifecycleService')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE

mongoose.connect(DB).then(() => {
    console.log('connected...')
})

app.listen(3000, () => {
    console.log('start')
})

setInterval(async () => {
    try {
        await bookingLifecycleService.expirePendingBookings()
        await bookingLifecycleService.completeFinishedBookings()
    } catch (error) {
        console.error('Booking lifecycle job failed:', error)
    }
}, 60 * 1000)
