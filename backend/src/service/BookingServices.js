const bookingRepository = require('../repositories/BookingRepository')
const timeSlotRepository = require('../repositories/TimeSlotRepository')
const AppError = require('../utils/AppError')

exports.createBooking = async (data) => {
    const { timeSlotId, userId, totalPrice } = data

    if (!timeSlotId) {
        throw new AppError('Please provide a timeSlotId for booking', 400)
    }

    const timeSlot = await timeSlotRepository.findById(timeSlotId)
    if (!timeSlot) {
        throw new AppError('No time slot found with that ID', 404)
    }

    if (timeSlot.status !== 'available') {
        throw new AppError('This time slot is not available for booking', 400)
    }

    const finalPrice = totalPrice !== undefined ? totalPrice : timeSlot.price

    // Cập nhật trạng thái slot thành 'booked'
    await timeSlotRepository.update(timeSlotId, { status: 'booked' })

    const booking = await bookingRepository.create({
        timeSlotId,
        userId,
        totalPrice: finalPrice,
        status: 'confirmed'
    })

    return booking
}

exports.getAllBookings = async () => {
    return bookingRepository.findAll()
}

exports.getMyBookings = async (userId) => {
    return bookingRepository.findByUser(userId)
}

exports.findBookingById = async (id) => {
    return bookingRepository.findById(id)
}

exports.updateBooking = async (id, data) => {
    const booking = await bookingRepository.findById(id)
    if (!booking) {
        return null
    }

    // Nếu hủy booking thì chuyển status của timeSlot về 'available'
    if (data.status === 'cancelled' && booking.status !== 'cancelled') {
        const slotId = booking.timeSlotId._id || booking.timeSlotId
        if (slotId) {
            await timeSlotRepository.update(slotId, { status: 'available' })
        }
    }

    return bookingRepository.update(id, data)
}

exports.cancelBooking = async (id, user) => {
    const booking = await bookingRepository.findById(id)
    if (!booking) {
        return null
    }

    const bookingUserId = booking.userId._id ? booking.userId._id.toString() : booking.userId.toString()
    const isOwner = bookingUserId === user.id.toString()

    if (!isOwner && user.role !== 'admin' && user.role !== 'pitch_owner') {
        throw new AppError('You do not have permission to cancel this booking', 403)
    }

    if (booking.status !== 'cancelled') {
        const slotId = booking.timeSlotId._id || booking.timeSlotId
        if (slotId) {
            await timeSlotRepository.update(slotId, { status: 'available' })
        }
    }

    return bookingRepository.update(id, { status: 'cancelled' })
}
