const Booking = require('../models/BookingModel')

exports.create = async (data) => {
    return Booking.create(data)
}

exports.findAll = async (filter = {}) => {
    return Booking.find(filter)
        .populate({
            path: 'timeSlotId',
            populate: { path: 'pitchId' }
        })
        .populate({
            path: 'userId',
            select: 'name email'
        })
}

exports.findById = async (id) => {
    return Booking.findById(id)
        .populate({
            path: 'timeSlotId',
            populate: { path: 'pitchId' }
        })
        .populate({
            path: 'userId',
            select: 'name email'
        })
}

exports.findByUser = async (userId) => {
    return Booking.find({ userId })
        .populate({
            path: 'timeSlotId',
            populate: { path: 'pitchId' }
        })
        .populate({
            path: 'userId',
            select: 'name email'
        })
}

exports.findByPitchIdNDate = async (pitchId, date) => {
    return Booking.find({
        date,
        status: { $ne: 'cancelled' }
    }) .populate({
            path: 'timeSlotId',
            populate: { path: 'pitchId' }
        })
        .populate({
            path: 'userId',
            select: 'name email'
        })
        .then(bookings => bookings.filter(booking =>
            booking.timeSlotId.some(slot => String(slot.pitchId?._id || slot.pitchId) === String(pitchId))
        ))
}

exports.expirePending = () => Booking.updateMany(
    { status: 'pending', expiresAt: { $lte: new Date() } },
    { $set: { status: 'cancelled' } }
)
``

exports.update = async (id, data) => {
    const booking = await Booking.findById(id)

    if (!booking) {
        return null
    }

    Object.assign(booking, data)
    return booking.save()
}

exports.delete = async (id) => {
    return Booking.findByIdAndDelete(id)
}
