const util = require('util')
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

exports.protect = catchAsync(async (req, res, next) => { 
    let token
    
    // Getting token and check of it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        
    }
    
    if (!token) {
        return next(new AppError('You are not logged in! Pleace log in to get access.'))
    }

    // Verification token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    

    // Check  if user still exists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist.'), 401)
    }

    // Check if user changed password after the token was issued
    if (freshUser.changedPasswordAt(decoded.iat)) {
        return next(new AppError('User recently chagned password! Please log in again', 401))
    }
    next()
})