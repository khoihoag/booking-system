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
