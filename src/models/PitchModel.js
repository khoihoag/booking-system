const mongoose = require('mongoose')
const { Schema }  = mongoose

const pitchSchema = new mongoose.Schema(
    {   
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        name: { 
            type: String,
            required: [true, 'a pitch must have a name']
        },
        address: {
            type: String,
            required: [true, 'a pitch must have a address']
        },
        pitch_type: {
            type: Number,
            default: 7,
            enum: {
                values: [5, 7, 11],
            }
        },
        surface_type: {
            type: String,
            default: 'artificial grass',
            enum: {
                values: ['artificial grass', 'natural grass'],
            }
        },
        status: {
            type: String,
            default: 'active',
            enum: {
                values: ['active', 'maintenance', 'inactive'],
            }
        },
        price: {
            type: Number,
            default: 200
        }
    }
)

const Pitch = mongoose.model('pitches', pitchSchema)

module.exports = Pitch

//  id
// - name              // "Sân 5 người A", "Sân 7 người B"
// - address          // thuộc cụm sân nào (nếu có nhiều cụm)
// - field_type         // 5-a-side, 7-a-side, 11-a-side
// - surface_type       // cỏ nhân tạo, cỏ tự nhiên
// - is_indoor          // có mái che không
// - status             // active, maintenance, inactive
// - base_price_per_hour // giá mặc định