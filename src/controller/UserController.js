const AppError = require('../utils/AppError')
const userServices = require('../service/UserServices')
const catchAsync = require('../utils/CatchAsyns')

exports.createUser = catchAsync(async (req, res, next) => {
    const user = await userServices.createUser(req.body)

    res.status(201).json({
        status: 'success',
        data: user
    })
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await userServices.findAllUsers()

    res.status(200).json({
        status: 'success',
        data: users
    })
})

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await userServices.findUserById(req.params.id)

    if (!user) {
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: user
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await userServices.updateUser(req.params.id, req.body)

    if (!user) {
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: user
    })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await userServices.deleteUser(req.params.id)

    if (!user) {
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(204).send()
})



// ME
exports.updateData = catchAsync(async (req, res, next) => {
    const updatedUser = await userServices.updateData(req.user.id, req.body)

    if (!updatedUser) {
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    const deleteMe = await userServices.deleteUser(req.user.id)

    if (!deleteMe) {
        return next(new AppError('No user found with that ID', 400))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const me = await userServices.findUserById(req.user.id)

    if (!me) {
        return next(new AppError('No user found with that ID', 400))
    }

    res.status(200).json({
        status: 'success',
        data: me
    })
})