const TimeSlot = require('./../models/TimeSlotModel')

exports.create = async (data) => {
    return TimeSlot.create(data)
}

exports.findAll = async () => {
    return TimeSlot.find()
}

exports.findById = async (id) => {
    return TimeSlot.findById(id)
}

exports.update = async (id, data) => {
    const timeSlot = await TimeSlot.findById(id)

    if (!timeSlot) {
        return null
    }

    Object.assign(timeSlot, data)
    return timeSlot.save()
}

exports.delete = async (id) => {
    return TimeSlot.findByIdAndDelete(id)   
}
