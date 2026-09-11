const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema(
    {
        field_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pitches',
            required: [true, 'a time slot must belong to a pitch']
        },
        start_time: {
            type: Date,
            required: [true, 'a time slot must have a start time']
        },
        end_time: {
            type: Date,
            required: [true, 'a time slot must have an end time']
        },
        date: {
            type: Date,
            required: [true, 'a time slot must have a date']
        },
        status: {
            type: String,
            default: 'available',
            enum: {
                values: ['available', 'booked', 'held', 'blocked', 'maintenance'],
                message: 'status must be available, booked, held, blocked, or maintenance'
            }
        },
        price: {
            type: Number,
            required: [true, 'a time slot must have a price'],
            min: [0, 'price must be greater than or equal to 0']
        },
        is_peak_hour: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

timeSlotSchema.pre('validate', function () {
    if (this.start_time && this.end_time && this.end_time <= this.start_time) {
        this.invalidate('end_time', 'end time must be after start time')
    }
})

const TimeSlot = mongoose.model('time_slots', timeSlotSchema)

module.exports = TimeSlot
