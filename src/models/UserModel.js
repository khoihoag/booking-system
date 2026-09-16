const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a valid email'],
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Please provide a valid password'],
    },
    password_confirm: {
        type: String,
        required: [true, 'Please provide a valid password'],
        validate: {
            validator:function (el) {
                return el == this.password
            },
            message: 'Passwords are not the same!'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}) 


UserSchema.pre('save', async function() {
    // chạy khi mặt khẩu đã đc biến đổi
    if(!this.isModified('password')) return

    // biến đổi mật khẩu
    this.password = await bcrypt.hash(this.password, 12)

    // xóa trường password_confirm
    this.password_confirm = undefined
    
})


const User = mongoose.model('users', UserSchema)

module.exports = User