const bookingRepository = require('../repositories/BookingRepository')
const timeSlotRepository = require('../repositories/TimeSlotRepository')
const AppError = require('../utils/AppError')

exports.createBooking = async (data) => {
    
    const { timeSlotId, userId, date } = data;

    if (!date) {
        throw new AppError('Please provide a booking date', 400);
    }

    const isMultiple = Array.isArray(timeSlotId);
    const timeSlotIds = isMultiple ? timeSlotId : [timeSlotId];

    if (timeSlotIds.length === 0 || !timeSlotIds[0]) {
        throw new AppError('Please provide a timeSlotId for booking', 400);
    }

    // Kiểm tra các ID bị trùng
    if (new Set(timeSlotIds.map(String)).size !== timeSlotIds.length) {
        throw new AppError('Duplicate timeSlotId is not allowed', 400);
    }

    const timeSlots = isMultiple
        ? await timeSlotRepository.findByIds(timeSlotIds)
        : [await timeSlotRepository.findById(timeSlotId)];

    if (timeSlots.some(slot => !slot)) {
        throw new AppError(isMultiple ? 'One or more time slots were not found' : 'No time slot found with that ID', 404);
    }

    const bookedSlots = await exports.findBookingsByDateNpitchId(date, timeSlots[0].pitchId);
    const bookedSlotIds = new Set(bookedSlots.flatMap(booking =>
        booking.timeSlotId.map(slot => String(slot._id || slot))
    ));
    const unavailableSlot = timeSlots.find(slot => bookedSlotIds.has(String(slot._id)));

    if (unavailableSlot) {
        throw new AppError(
            isMultiple ? 'One or more time slots are not available for booking' : 'This time slot is not available for booking',
            400
        );
    }

    // Tạo booking
    const booking = await bookingRepository.create({
        timeSlotId,
        userId,
        date,
        status: 'confirmed'
    });

    return booking;
};

exports.getAllBookings = async () => {
    return bookingRepository.findAll()
}

exports.getMyBookings = async (userId) => {
    return bookingRepository.findByUser(userId)
}

exports.findBookingsByDateNpitchId = async (date, pitchId) => {
    return bookingRepository.findByPitchIdNDate(pitchId, date)
}

exports.findBookingById = async (id) => {
    return bookingRepository.findById(id)
}

const allowedTransitions = {
    pending: new Set(['confirmed', 'cancelled']),
    confirmed: new Set(['completed', 'cancelled']),
    completed: new Set(),
    cancelled: new Set()
}

exports.updateBooking = async (id, data, user) => {
    const booking = await bookingRepository.findById(id)
    if (!booking) {
        return null
    }

    const bookingUserId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString()
    const currentUserId = (user?._id || user?.id || user)?.toString()
    const isOwner = bookingUserId && currentUserId && bookingUserId === currentUserId
    if (!isOwner && user?.role !== 'admin' && user?.role !== 'pitch_owner') {
        throw new AppError('You do not have permission to update this booking', 403)
    }

    const nextStatus = data.status
    if (!nextStatus || Object.keys(data).some(key => key !== 'status')) {
        throw new AppError('Only booking status can be updated', 400)
    }
    if (nextStatus !== 'cancelled' && user?.role !== 'admin' && user?.role !== 'pitch_owner') {
        throw new AppError('Only the pitch owner or admin can confirm or complete a booking', 403)
    }
    if (!allowedTransitions[booking.status]?.has(nextStatus)) {
        throw new AppError(`Cannot change booking from ${booking.status} to ${nextStatus}`, 400)
    }

    return bookingRepository.update(id, { status: nextStatus })
}

exports.cancelBooking = async (id, user) => {
    const booking = await bookingRepository.findById(id)
    if (!booking) {
        return null
    }

    const bookingUserId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString()
    const currentUserId = (user?._id || user?.id || user)?.toString()
    const isOwner = bookingUserId && currentUserId && bookingUserId === currentUserId

    if (!isOwner && user?.role !== 'admin' && user?.role !== 'pitch_owner') {
        throw new AppError('You do not have permission to cancel this booking', 403)
    }

    if (!allowedTransitions[booking.status]?.has('cancelled')) {
        throw new AppError(`Cannot cancel a ${booking.status} booking`, 400)
    }

    return bookingRepository.update(id, { status: 'cancelled' })
}
