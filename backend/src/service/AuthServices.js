const util = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const AppError = require('../utils/AppError')
const userRepository = require('../repositories/UserRepository')
const sendEmail = require('../utils/Email')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = async (userData) => {
    const newUser = await userRepository.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm,
    })

    const token = signToken(newUser._id)
    return { user: newUser, token }
}

exports.login = async (email, password) => {
    if (!email || !password) {
        throw new AppError('Vui lòng nhập email và mật khẩu.', 400)
    }

    const user = await userRepository.findByEmail(email, true)
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Email hoặc mật khẩu không chính xác.', 401)
    }

    // Hide password before returning
    user.password = undefined

    const token = signToken(user._id)
    return { user, token }
}

exports.protect = async (token) => {
    if (!token) {
        throw new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.', 401)
    }

    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)

    const currentUser = await userRepository.findById(decoded.id)
    if (!currentUser) {
        throw new AppError('Tài khoản không còn tồn tại. Vui lòng đăng nhập lại.', 401)
    }

    if (currentUser.changedPassword(decoded.iat)) {
        throw new AppError('Mật khẩu vừa được thay đổi. Vui lòng đăng nhập lại.', 401)
    }

    return currentUser
}

exports.forgotPassword = async (email, protocol, host) => {
    if (!email) {
        throw new AppError('Vui lòng nhập địa chỉ email.', 400)
    }

    const user = await userRepository.findByEmail(email)
    if (!user) {
        throw new AppError('Không tìm thấy tài khoản với email này.', 404)
    }

    const resetToken = user.createResetPasswordToken()
    await userRepository.saveUser(user, { validateBeforeSave: false })

    const resetURL = `${protocol}://${host}/api/user/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and password_confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpries = undefined
        await userRepository.saveUser(user, { validateBeforeSave: false })

        throw new AppError('Không thể gửi email. Vui lòng thử lại sau.', 500)
    }

    return resetToken
}

exports.resetPassword = async (token, password, password_confirm) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await userRepository.findByResetToken(hashedToken)
    if (!user) {
        throw new AppError('Mã xác thực không hợp lệ hoặc đã hết hạn.', 400)
    }

    user.password = password
    user.password_confirm = password_confirm
    user.passwordResetToken = undefined
    user.passwordResetExpries = undefined

    await userRepository.saveUser(user)

    const newToken = signToken(user._id)
    return { user, token: newToken }
}

exports.updatePassword = async (userId, passwordCurrent, password, password_confirm) => {
    const user = await userRepository.findById(userId, true)
    if (!user) {
        throw new AppError('Không tìm thấy tài khoản.', 404)
    }

    if (!(await user.correctPassword(passwordCurrent, user.password))) {
        throw new AppError('Mật khẩu hiện tại không chính xác.', 401)
    }

    user.password = password
    user.password_confirm = password_confirm

    await userRepository.saveUser(user)

    const token = signToken(user._id)
    return { user, token }
}
