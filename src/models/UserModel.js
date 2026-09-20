const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const cryto = require('crypto')

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
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpries: Date,
}) 

// Không cho password dạng plain text được lưu trực tiếp vào database.
UserSchema.pre('save', async function() {
    // chạy khi mặt khẩu đã đc biến đổi
    if(!this.isModified('password')) return

    // biến đổi mật khẩu
    this.password = await bcrypt.hash(this.password, 12)

    // xóa trường password_confirm
    this.password_confirm = undefined
    
})

// Ghi lại thời điểm user thay đổi password.
UserSchema.pre('save', function() {
    if(!this.isModified('password') || this.isNew) return 

    this.passwordChangeAt = Date.now() -  1000
})

// Tạo method cho mỗi UserDocument
// candidatePassword: mật khảu được nhập vào khi đăng nhập, sẽ được hàm compare tự động hash để so sánh với userPassword được lưu trong database
UserSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changedPassword = (JWTTimeStamp) => {
    if (this.passwordChangeAt) {
        const changedTimeStamp = this.passwordChangeAt.getTime() / 1000
        return JWTTimeStamp < changedTimeStamp
    }

    return false
}

UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = cryto.randomBytes(32).toString('hex')

    this.passwordResetToken = cryto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpries = Date.now() + 5 * 60 * 1000
    
    return resetToken 
}


const User = mongoose.model('users', UserSchema)

module.exports = User