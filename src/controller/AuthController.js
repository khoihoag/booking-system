const jwt = require('jsonwebtoken')

const AppError = require('./../utils/AppError')
const userServices = require('./../service/UserServices')
const catchAsync = require('./../utils/CatchAsyns')
const User = require('./../models/UserModel')

const signToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


exports.signup = catchAsync(async (req, res) => {
    const newUser = await userServices.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password_confirm: req.body.password_confirm
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data:  newUser
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(new AppError('Provide email and password', 404))
    }

    const user = await User.findOne({email: email})
    const correct = await user.correctPassword(password, user.password)

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password'))
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token
    })
})