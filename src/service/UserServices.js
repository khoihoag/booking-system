const UserRepository = require('./../repositories/UserRepository')

exports.createUser = async (data) => {
    console.log(2)
    return UserRepository.create(data)
}

exports.findAllUsers = async () => {
    return UserRepository.findAll()
}

exports.findUserById = async (id) => {
    return UserRepository.findById(id)
}

exports.updateUser = async (id, data) => {
    return UserRepository.update(id, data)
}

exports.deleteUser = async (id) => {
    return UserRepository.delete(id)
}
