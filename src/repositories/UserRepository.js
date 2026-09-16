const User = require('./../models/UserModel')

exports.create = async data => {
    console.log(data)
    const user = await User.create(data)
    console.log(4)
    return user
}

exports.findAll = () => {
    return User.find()
}

exports.findById = (id) => {
    return User.find(id)
}

exports.update = async (id, data) => {
    const user = await User.find(id)

    if (!user) return null

    Object.assign(user, data)
    return user.save()
}

exports.delete = (id) => {
    return User.findByIdAndDelete(id)
}