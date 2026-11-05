const bookingRepository = require('../repositories/BookingRepository')
const timeSlotRepository = require('../repositories/TimeSlotRepository')
const AppError = require('../utils/AppError')

exports.createBooking = async (data) => {
    
    const { timeSlotId, userId } = data;

    // Kiểm tra danh sách timeSlotId
    if (!Array.isArray(timeSlotId) || timeSlotId.length === 0) {
        throw new AppError('Please provide at least one timeSlotId', 400);
    }

    // Kiểm tra các ID bị trùng
    if (new Set(timeSlotId.map(String)).size !== timeSlotId.length) {
        throw new AppError('Duplicate timeSlotId is not allowed', 400);
    }

    // Tìm tất cả time slots
    const timeSlots = await timeSlotRepository.findByIds(timeSlotId);

    if (timeSlots.length !== timeSlotId.length) {
        throw new AppError('One or more time slots were not found', 404);
    }

    // Kiểm tra trạng thái của tất cả slots
    const unavailableSlot = timeSlots.find(
        slot => slot.status !== 'available'
    );

    if (unavailableSlot) {
        throw new AppError(
            'One or more time slots are not available for booking',
            400
        );
    }

    // Cập nhật trạng thái tất cả slots thành booked
    await timeSlotRepository.updateMany(
        timeSlotId,
        { status: 'booked' }
    );

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

    const bookingUserId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString()
    const currentUserId = (user?._id || user?.id || user)?.toString()
    const isOwner = bookingUserId && currentUserId && bookingUserId === currentUserId

    if (!isOwner && user?.role !== 'admin' && user?.role !== 'pitch_owner') {
        throw new AppError('You do not have permission to cancel this booking', 403)
    }

    if (booking.status !== 'cancelled') {
        const slotId = booking.timeSlotId?._id || booking.timeSlotId
        if (slotId) {
            await timeSlotRepository.update(slotId, { status: 'available' })
        }
    }

    return bookingRepository.update(id, { status: 'cancelled' })
}
