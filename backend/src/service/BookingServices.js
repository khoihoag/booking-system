const bookingRepository = require('../repositories/BookingRepository')
const timeSlotRepository = require('../repositories/TimeSlotRepository')
const AppError = require('../utils/AppError')

exports.createBooking = async (data) => {
    
    const { timeSlotId, userId } = data;

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

    // Kiểm tra trạng thái của tất cả slots
    const unavailableSlot = timeSlots.find(
        slot => slot.status !== 'available'
    );

    if (unavailableSlot) {
        throw new AppError(
            isMultiple ? 'One or more time slots are not available for booking' : 'This time slot is not available for booking',
            400
        );
    }

    // Cập nhật trạng thái tất cả slots thành booked
    if (isMultiple) {
        await timeSlotRepository.updateMany(timeSlotIds, { status: 'booked' });
    } else {
        await timeSlotRepository.update(timeSlotId, { status: 'booked' });
    }

    // Tạo booking
    const booking = await bookingRepository.create({
        timeSlotId,
        userId,
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
        const slotIds = Array.isArray(booking.timeSlotId)
            ? booking.timeSlotId
            : [booking.timeSlotId]
        for (const slot of slotIds) {
            const slotId = slot?._id || slot
            if (slotId) await timeSlotRepository.update(slotId, { status: 'available' })
        }
    }

    return bookingRepository.update(id, data)
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

    if (booking.status !== 'cancelled') {
        const slotIds = Array.isArray(booking.timeSlotId)
            ? booking.timeSlotId
            : [booking.timeSlotId]
        for (const slot of slotIds) {
            const slotId = slot?._id || slot
            if (slotId) await timeSlotRepository.update(slotId, { status: 'available' })
        }
    }

    return bookingRepository.update(id, { status: 'cancelled' })
}
