const bookingRepository = require('../repositories/BookingRepository')
const timeSlotRepository = require('../repositories/TimeSlotRepository')
const AppError = require('../utils/AppError')
const bookingLifecycleService = require('./BookingLifecycleService')

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
        status: 'pending',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    return booking;
};

exports.getAllBookings = async () => {
    await bookingRepository.expirePending()
    return bookingRepository.findAll()
}

exports.getMyBookings = async (userId) => {
    await bookingRepository.expirePending()
    return bookingRepository.findByUser(userId)
}

exports.findBookingsByDateNpitchId = async (date, pitchId) => {
    return bookingRepository.findByPitchIdNDate(pitchId, date)
}

exports.findBookingById = async (id) => {
    await bookingRepository.expirePending()
    return bookingRepository.findById(id)
}

exports.updateBooking = async (id, data, user) => {
    if (!data.status || Object.keys(data).some(key => key !== 'status')) {
        throw new AppError('Only booking status can be updated', 400)
    }
    const handlers = {
        confirmed: bookingLifecycleService.confirmBooking,
        cancelled: bookingLifecycleService.cancelBooking,
        refunded: bookingLifecycleService.refundBooking,
        completed: bookingLifecycleService.completeBooking
    }
    if (!handlers[data.status]) throw new AppError('Invalid booking status transition', 400)
    return handlers[data.status](id, user)
}

exports.cancelBooking = (id, user) => bookingLifecycleService.cancelBooking(id, user)
