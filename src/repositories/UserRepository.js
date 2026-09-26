const User = require('../models/UserModel')

exports.create = async (data) => {
    return await User.create(data)
}

exports.findAll = async () => {

const user = await User
        .findById('6ab0f533e30e7081baee4ed5')
        .populate('pitches')
    console.log(user)
    console.log('PITCHES:', user.pitches)

    return await User.find().populate('pitches')
}

exports.findById = async (id, selectPassword = false) => {
    if (selectPassword) {
        return await User.findById(id).select('+password')
    }
    return await User.findById(id).populate('pitches')
}

exports.findByEmail = async (email, selectPassword = false) => {
    if (selectPassword) {
        return await User.findOne({ email }).select('+password')
    }
    return await User.findOne({ email })
}

exports.findByResetToken = async (hashedToken) => {
    return await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpries: { $gt: Date.now() }
    })
}

exports.update = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
}

exports.saveUser = async (user, options = {}) => {
    return await user.save(options)
}

exports.delete = async (id) => {
    return await User.findByIdAndDelete(id)
}

exports.deleteMe = async (id) => {
    return await User.findByIdAndUpdate(id, {active: false})
}