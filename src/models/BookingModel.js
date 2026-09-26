const mongoose = require('mongoose')
const TimeSlot = require('./TimeSlotModel')

const BookingShema = new mongoose.Schema({
    timeSlotId: {
        type: Schema.Types.ObjectId,
        ref: 'time_slots',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed']
    },
    status: {
        type: String,
    }
})


const booking = mongoose.model('booking', BookingShema)

module.exports = booking