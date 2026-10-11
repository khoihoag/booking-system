const mongoose = require('mongoose')
const { Schema } = mongoose

const bookingSchema = new mongoose.Schema(
    {
        timeSlotId: {
            type: Schema.Types.ObjectId,
            ref: 'time_slots',
            required: [true, 'A booking must have a time slot']
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'A booking must belong to a user']
        },
        totalPrice: {
            type: Number,
            required: [true, 'A booking must have a total price']
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'confirmed', 'cancelled', 'completed'],
                message: 'Status must be pending, confirmed, cancelled, or completed'
            },
            default: 'confirmed'
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const Booking = mongoose.model('booking', bookingSchema)

module.exports = Booking