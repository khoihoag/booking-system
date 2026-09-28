const userRepository = require('../repositories/UserRepository')
const AppError = require('../utils/AppError')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.createUser = async (body) => {
    const filteredBody = filterObj(body, 'name', 'email', 'password', 'password_confirm', 'role')
    return userRepository.create(filteredBody)
}

exports.findAllUsers = async () => {
    return userRepository.findAll()
}

exports.findUserById = async (id) => {
    return userRepository.findById(id)
}

exports.updateUser = async (userId, body) => {
    if (body.password || body.password_confirm) {
        throw new AppError('Can not update password', 400)
    }

    const filteredBody = filterObj(body, 'name', 'email', 'role')
    const updatedUser = await userRepository.update(userId, filteredBody)

    if (!updatedUser) {
        throw new AppError('No user found with that ID', 404)
    }

    return updatedUser
}


exports.deleteUser = async (id) => {
    return userRepository.delete(id)
}

exports.updateData = async (userId, body) => {
    if (body.password || body.password_confirm) {
        throw new AppError('This route is not for password updates. Please use /updatePassword', 400)
    }

    const filteredBody = filterObj(body, 'name', 'email')
    const updatedUser = await userRepository.update(userId, filteredBody)

    if (!updatedUser) {
        throw new AppError('No user found with that ID', 404)
    }

    return updatedUser
}

