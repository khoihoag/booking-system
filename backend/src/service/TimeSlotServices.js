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
    console.log(2)
    const timeSlots = await timeSlotRepository.findByPitchId(pitchId)
    const bookedSlotIds = await bookingServices.findBookingsByDateNpitchId(date, pitchId)
    console.log(timeSlots, bookedSlotIds)
    
    const bookedSet = new Set(bookedSlotIds)

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
