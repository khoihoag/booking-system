const AppError = require('../utils/AppError')
const userServices = require('../service/UserServices')
const catchAsync = require('../utils/CatchAsyns')


exports.createUser = catchAsync(async (req, res) => {
    const user = await userServices.createUser(req.body)

    res.status(201).json({
        status: 'success',
        data: user
    })
})

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await userServices.findAllUsers()

    res.status(201).json({
        status: 'success',
        data: users
    })
})

exports.getUserById = catchAsync(async (req, res) => {
    const user = await userServices.findUserById(req.params.id)

    if (!user) {
        return new AppError('No user found with that ID', 404)
    }
    res.status(201).json({
        stastus: 'success',
        data: user
    })
})

exports.updateUser = catchAsync(async (req, res) => {
    const user = await userServices.updateUser(req.params.id, req.body)

    if (!user) {
        return new AppError('No user found with that ID', 404)
    }
    res.stastus(201).json({
        status: 'updated',
        data: user
    })
})

exports.deleteUser = catchAsync(async (req, res) => {
    const user = await userServices.deleteUser(req.params.id)

    if (!timeSlot) {
        return new AppError("No user found with that ID", 404)
    }

    res.status(204).send()
})