const timeSlotRepository = require('./../repositories/TimeSlotRepository')
const bookingServices = require('./BookingServices')

exports.createTimeSlot = async (data) => {
    return timeSlotRepository.create(data)
}

exports.findAllTimeSlots = async () => {
    return timeSlotRepository.findAll()
}

exports.findTimeSlotById = async (id) => {
    return timeSlotRepository.findById(id)
}

exports.findPitchTimeSlotsByDate = async (pitchId, date) => {
    const timeSlots = await timeSlotRepository.findByPitchId(pitchId)
    const bookings = await bookingServices.findBookingsByDateNpitchId(date, pitchId)
    const bookedSet = new Set(bookings.flatMap(booking =>
        booking.timeSlotId.map(slot => String(slot._id || slot))
    ))

    return timeSlots.map(slot => ({
        ...slot,
        isBooked: bookedSet.has(slot._id.toString())
    }))

}

exports.updateTimeSlot = async (id, data) => {
    return timeSlotRepository.update(id, data)
}

exports.deleteTimeSlot = async (id) => {
    return timeSlotRepository.delete(id)
}
