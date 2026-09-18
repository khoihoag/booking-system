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
        },
        selcect: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    changedPasswordAt: Date,
}) 


UserSchema.pre('save', async function() {
    // chạy khi mặt khẩu đã đc biến đổi
    if(!this.isModified('password')) return

    // biến đổi mật khẩu
    this.password = await bcrypt.hash(this.password, 12)

    // xóa trường password_confirm
    this.password_confirm = undefined
    
})

// Tạo method cho mỗi UserDocument
// candidatePassword: mật khảu được nhập vào khi đăng nhập, sẽ được hàm compare tự động hash để so sánh với userPassword được lưu trong database
UserSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changedPassword = (JWTTimeStamp) => {
    if (this.changedPasswordAt) {
        const changedTimeStamp = this.changedPasswordAt.getTime() / 1000
        return JWTTimeStamp < changedTimeStamp
    }

    return false
}


const User = mongoose.model('users', UserSchema)

module.exports = User