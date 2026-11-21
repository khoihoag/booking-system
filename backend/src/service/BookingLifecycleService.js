const bookingRepository = require('../repositories/BookingRepository')
const AppError = require('../utils/AppError')

const transitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['refunded', 'completed'],
    cancelled: [], refunded: [], completed: []
}

const getUserId = user => (user?._id || user?.id || user)?.toString()

const assertOwnerOrStaff = (booking, user) => {
    const ownerId = booking.userId?._id?.toString() || booking.userId?.toString()
    if (ownerId !== getUserId(user) && !['admin', 'pitch_owner'].includes(user?.role)) {
        throw new AppError('You do not have permission to update this booking', 403)
    }
}

const changeStatus = async (bookingId, nextStatus, user, roles = []) => {
    const booking = await bookingRepository.findById(bookingId)
    if (!booking) throw new AppError('No booking found with that ID', 404)
    assertOwnerOrStaff(booking, user)
    if (roles.length && !roles.includes(user?.role)) {
        throw new AppError('You do not have permission to perform this action', 403)
    }
    if (!transitions[booking.status]?.includes(nextStatus)) {
        throw new AppError(`Cannot change booking from ${booking.status} to ${nextStatus}`, 400)
    }
    if (booking.status === 'pending' && booking.expiresAt <= new Date()) {
        await bookingRepository.update(bookingId, { status: 'cancelled' })
        throw new AppError('Payment window has expired', 400)
    }

    const data = { status: nextStatus }
    if (nextStatus === 'confirmed') Object.assign(data, { paidAt: new Date(), expiresAt: null })
    if (nextStatus === 'refunded') data.refundedAt = new Date()
    if (nextStatus === 'completed') data.completedAt = new Date()
    return bookingRepository.update(bookingId, data)
}

exports.confirmBooking = (id, user) => changeStatus(id, 'confirmed', user)
exports.cancelBooking = (id, user) => changeStatus(id, 'cancelled', user)
exports.refundBooking = (id, user) => changeStatus(id, 'refunded', user, ['admin', 'pitch_owner'])
exports.completeBooking = (id, user) => changeStatus(id, 'completed', user, ['admin', 'pitch_owner'])

exports.expireBooking = async id => {
    const booking = await bookingRepository.findById(id)
    if (!booking) throw new AppError('No booking found with that ID', 404)
    if (booking.status !== 'pending' || booking.expiresAt > new Date()) return booking
    return bookingRepository.update(id, { status: 'cancelled' })
}

exports.expirePendingBookings = () => bookingRepository.expirePending()

exports.completeFinishedBookings = async () => {
    const bookings = await bookingRepository.findAll({ status: 'confirmed' })
    const now = new Date()

    await Promise.all(bookings.map(async booking => {
        const endTimes = (booking.timeSlotId || []).map(slot => {
            const match = slot.time?.match(/-\s*(\d{1,2}):(\d{2})/)
            if (!match) return null
            const end = new Date(booking.date)
            end.setHours(Number(match[1]), Number(match[2]), 0, 0)
            return end
        }).filter(Boolean)

        const matchEnd = endTimes.sort((a, b) => b - a)[0]
        if (matchEnd && matchEnd <= now) {
            await bookingRepository.update(booking._id, {
                status: 'completed',
                completedAt: now
            })
        }
    }))
}

exports.transitions = transitions
