const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
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
        required: [true, 'Please provide a password'],
        select: false
    },
    password_confirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same!'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'pitch_owner'],
        default: 'user'
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpries: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    }
}) 

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 12)
    this.password_confirm = undefined
})

// Update passwordChangeAt property before saving if password was modified
UserSchema.pre('save', function() {
    if (!this.isModified('password') || this.isNew) return

    this.passwordChangeAt = Date.now() - 1000
})

UserSchema.pre(/^find/, function() {
    this.find({active: {$ne: false}})   
})


// Compare candidate password with stored hashed password
UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

// Check if user changed password after token issuance
UserSchema.methods.changedPassword = function (JWTTimeStamp) {
    if (this.passwordChangeAt) {
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)
        return JWTTimeStamp < changedTimeStamp
    }

    return false
}

// Generate random password reset token
UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpries = Date.now() + 10 * 60 * 1000 // 10 minutes

    return resetToken 
}

const User = mongoose.model('users', UserSchema)

module.exports = User
