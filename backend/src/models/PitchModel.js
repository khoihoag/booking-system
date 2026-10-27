const mongoose = require('mongoose')
const { Schema } = mongoose

const pitchSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: function () {
                return this._id ? this._id.toString() : undefined
            }
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        imageUrl: {
            type: String,
            default: ''
        },
        name: { 
            type: String,
            required: [true, 'a pitch must have a name']
        },
        pitchType: {
            type: String,
            enum: {
                values: ['5-a-side', '7-a-side', '11-a-side'],
                message: 'pitchType must be 5-a-side, 7-a-side, or 11-a-side'
            },
            default: '7-a-side'
        },
        rating: {
            type: Number,
            default: 5.0,
            min: [0, 'rating must be at least 0'],
            max: [5, 'rating cannot be more than 5']
        },
        address: {
            type: String,
            required: [true, 'pitch must have address']
        },
        description: {
            type: String,
            default: ''
        },
        facilities: {
            type: [String],
            default: []
        },
        pricePerHour: {
            type: Schema.Types.Mixed,
            default: 200000
        },
        status: {
            type: String,
            default: 'active',
            enum: {
                values: ['active', 'maintenance', 'inactive'],
            }
        }
    },
    {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                if (!ret.id && ret._id) {
                    ret.id = ret._id.toString()
                }
                return ret
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                if (!ret.id && ret._id) {
                    ret.id = ret._id.toString()
                }
                return ret
            }
        }
    }
)

pitchSchema.virtual('price')
    .get(function () {
        return this.pricePerHour
    })
    .set(function (v) {
        this.pricePerHour = v
    })

pitchSchema.virtual('pitch_type')
    .get(function () {
        if (this.pitchType === '5-a-side') return 5
        if (this.pitchType === '7-a-side') return 7
        if (this.pitchType === '11-a-side') return 11
        return 7
    })
    .set(function (v) {
        if (v === 5 || v === '5' || v === '5-a-side') this.pitchType = '5-a-side'
        else if (v === 11 || v === '11' || v === '11-a-side') this.pitchType = '11-a-side'
        else this.pitchType = '7-a-side'
    })

pitchSchema.pre('save', function () {
    if (!this.id && this._id) {
        this.id = this._id.toString()
    }
    if (!this.location && this.address) {
        this.location = this.address
    } else if (!this.address && this.location) {
        this.address = this.location
    }
    if (this.pricePerHour === undefined && this.price !== undefined) {
        this.pricePerHour = this.price
    }
})

pitchSchema.virtual('time_slots', {
    ref: "TimeSlot",
    localField: "_id",
    foreignField: "pitchId"
})

const Pitch = mongoose.model('pitches', pitchSchema)

module.exports = Pitch
