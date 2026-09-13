const timeSlotServices = require('./../service/TimeSlotServices')
const catchAsync = require('./../utils/CatchAsyns')
const AppError = require('./../utils/AppError')


exports.createTimeSlot = catchAsync(async (req, res) => {

    const timeSlot = await timeSlotServices.createTimeSlot(req.body)

    res.status(201).json({
        status: 'created',
        data: timeSlot
    })
})

exports.getAllTimeSlots = catchAsync(async (req, res) => {
    const timeSlots = await timeSlotServices.findAllTimeSlots()

    res.status(200).json({
        status: 'success',
        data: timeSlots
    })
})

exports.getTimeSlotById = catchAsync(async (req, res) => {
    
    const timeSlot = await timeSlotServices.findTimeSlotById(req.params.id)

    if (!timeSlot) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(200).json({
        status: 'success',
        data: timeSlot
    })  
})

exports.updateTimeSlot = catchAsync(async (req, res) => {
    
    const timeSlot = await timeSlotServices.updateTimeSlot(req.params.id, req.body)

    if (!timeSlot) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(200).json({
        status: 'updated',
        data: timeSlot
    })
  
})

exports.deleteTimeSlot = catchAsync(async (req, res) => {

    const timeSlot = await timeSlotServices.deleteTimeSlot(req.params.id)

    if (!timeSlot) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(204).send()
})
