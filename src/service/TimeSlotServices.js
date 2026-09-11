const timeSlotRepository = require('./../repositories/TimeSlotRepository')

exports.createTimeSlot = async (data) => {
    return timeSlotRepository.create(data)
}

exports.findAllTimeSlots = async () => {
    return timeSlotRepository.findAll()
}

exports.findTimeSlotById = async (id) => {
    return timeSlotRepository.findById(id)
}

exports.updateTimeSlot = async (id, data) => {
    return timeSlotRepository.update(id, data)
}

exports.deleteTimeSlot = async (id) => {
    return timeSlotRepository.delete(id)
}
