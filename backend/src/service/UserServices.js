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
    const filteredBody = filterObj(body, 'name', 'email', 'password', 'password_confirm', 'role', 'phone', 'city', 'bio', 'preferredType', 'position', 'preferredFoot', 'jerseyNumber', 'twoFactorEnabled', 'smsReminder', 'zaloNotification', 'promoAlerts')
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
        throw new AppError('Không thể đổi mật khẩu ở chức năng cập nhật thông tin.', 400)
    }

    const filteredBody = filterObj(body, 'name', 'email', 'role', 'phone', 'city', 'bio', 'preferredType', 'position', 'preferredFoot', 'jerseyNumber', 'twoFactorEnabled', 'smsReminder', 'zaloNotification', 'promoAlerts')
    const updatedUser = await userRepository.update(userId, filteredBody)

    if (!updatedUser) {
        throw new AppError('Không tìm thấy tài khoản.', 404)
    }

    return updatedUser
}


exports.deleteUser = async (id) => {
    return userRepository.delete(id)
}

exports.updateData = async (userId, body) => {
    if (body.password || body.password_confirm) {
        throw new AppError('Vui lòng dùng chức năng đổi mật khẩu riêng.', 400)
    }

    const filteredBody = filterObj(body, 'name', 'email', 'phone', 'city', 'bio', 'preferredType', 'position', 'preferredFoot', 'jerseyNumber', 'twoFactorEnabled', 'smsReminder', 'zaloNotification', 'promoAlerts')
    const updatedUser = await userRepository.update(userId, filteredBody)

    if (!updatedUser) {
        throw new AppError('Không tìm thấy tài khoản.', 404)
    }

    return updatedUser
}

