const AppError = require("../utils/AppError")

const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational === true) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}

const handleJWTError = () => new AppError('Token không hợp lệ. Vui lòng đăng nhập lại.', 401)

const handleJWTExpiredError = () => new AppError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401)
const handleValidationError = err => new AppError(
    Object.values(err.errors).map(error => error.message).join(' '),
    400,
)
const handleDuplicateFieldsError = () => new AppError('Email đã được sử dụng.', 400)

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else {
        if (err.name === 'JsonWebTokenError') err = handleJWTError(err)
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()
        if (err.name === 'ValidationError') err = handleValidationError(err)
        if (err.code === 11000) err = handleDuplicateFieldsError(err)
        sendErrorProd(err, res)
    }
}
