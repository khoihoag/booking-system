const util = require('util')
const jwt = require('jsonwebtoken')
const cryto = require('crypto')

const AppError = require('./../utils/AppError')
const userServices = require('./../service/UserServices')
const catchAsync = require('./../utils/CatchAsyns')
const User = require('./../models/UserModel')
const SendEmail = require('./../utils/Email')


const signToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data:  user
    })
}

// Đăng ký
exports.signup = catchAsync(async (req, res) => {
    // Tạo user dựa trên data từ req
    const newUser = await userServices.createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password_confirm: req.body.password_confirm
    });
    // Tạo token từ id của user được tạo dưới db
    createSendToken(newUser, 201, res)
})

// Đăng nhập
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

    createSendToken(user, 201, res)
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

    // Check  if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.'), 401)
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPassword(decoded.iat)) {
        return next(new AppError('User recently chagned password! Please log in again', 401))
    }

    req.user = currentUser
    next()
})


// phân cấp: user đúng roll mới thực hiện được hành động
exports.restrictTo = (role) => {
    
    return (req, res, next) => {
        console.log(req.user.role)

        if (role !== req.user.role) {
            return next(new AppError('You do not have permission ton perform this action.', 401))
        }
        next()
    }
}


// User nhập email → server tạo một reset token → gửi token qua email → user dùng token đó để đặt mật khẩu mới.
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // TÌm user bằng email
    const user = await User.findOne({email: req.body.email })

    if (!user) {
        return next(new AppError('There are no user with email adress', 404))
    }

    // Tạo reset token 
    const resetToken = user.createResetPasswordToken()
    await user.save({validateBeforeSave: false})    // save vì các thay đổi với obj user từ func createResetPasswordToken chỉ là thay đỏi trên RAM cần save để thay đổi dưới db

    //Gửi reset token qua email
    const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`

    const message = `Forgot your password? Submmit a PATCH request with your new password and passwordConfirm to: ${resetURL}`

    try {
        await SendEmail({
            email: user.email,
            message,
        })
    
        res.status(200).json({
            status:'success'
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpries = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError('There was an error sending email', 500))
    }

})

// Hàm đổi mật khẩu khi user nhận được token
exports.resetPassword = catchAsync(async (req, res, next) => {
    //  Get user
    // hash reset token để tìm user trong db
    const hashToken = cryto.createHash('sha256').update(req.params.token).digest('hex')
    console.log(hashToken, new Date(Date.now()))

    const user = await User.findOne({
        passwordResetToken: hashToken
    })
    console.log("user:", user)
    console.log("hashed resetToken:", hashToken, user.passwordResetToken)
    console.log(user.passwordResetExpries, Date.now())

    // 
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password
    user.password_confirm = req.body.password_confirm
    user.passwordResetToken = undefined
    user.passwordResetExpries = undefined

    await user.save()
    

    createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    if (!await User.correctPassword(req.body.passwordCurrent, user.password)) {
        return next(new AppError('Your current password is wrong', 401))
    }

    user.password = req.body.passwordCurrent
    user.password_confirm = req.body.password_confirm
    await user.save()

    createSendToken(user, 200, res )
})