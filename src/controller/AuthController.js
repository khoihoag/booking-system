const authServices = require('../service/AuthServices')
const catchAsync = require('../utils/CatchAsyns')
const AppError = require('../utils/AppError')

const createSendToken = (user, statusCode, token, res) => {
    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    })
}

// Đăng ký
exports.signup = catchAsync(async (req, res, next) => {
    const { user, token } = await authServices.signup(req.body)
    createSendToken(user, 201, token, res)
})

// Đăng nhập
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const { user, token } = await authServices.login(email, password)
    createSendToken(user, 200, token, res)
})

// Middleware bảo vệ route (yêu cầu login)
exports.protect = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    const currentUser = await authServices.protect(token)
    req.user = currentUser
    next()
})

// Middleware phân quyền
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403))
        }
        next()
    }
}

// Quên mật khẩu
exports.forgotPassword = catchAsync(async (req, res, next) => {
    await authServices.forgotPassword(req.body.email, req.protocol, req.get('host'))

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    })
})

// Đặt lại mật khẩu qua token
exports.resetPassword = catchAsync(async (req, res, next) => {
    const { user, token } = await authServices.resetPassword(
        req.params.token,
        req.body.password,
        req.body.password_confirm
    )

    createSendToken(user, 200, token, res)
})

// Cập nhật mật khẩu khi đã đăng nhập
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { user, token } = await authServices.updatePassword(
        req.user.id,
        req.body.passwordCurrent,
        req.body.password,
        req.body.password_confirm
    )

    createSendToken(user, 200, token, res)
})