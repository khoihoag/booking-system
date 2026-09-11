const timeSlotServices = require('./../service/TimeSlotServices')

const sendError = (res, err) => {
    const statusCode = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500

    return res.status(statusCode).json({
        status: 'error',
        message: err.message
    })
}

exports.createTimeSlot = async (req, res) => {
    try {
        const timeSlot = await timeSlotServices.createTimeSlot(req.body)

        res.status(201).json({
            status: 'created',
            data: timeSlot
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.getAllTimeSlots = async (req, res) => {
    try {
        const timeSlots = await timeSlotServices.findAllTimeSlots()

        res.status(200).json({
            status: 'success',
            data: timeSlots
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.getTimeSlotById = async (req, res) => {
    try {
        const timeSlot = await timeSlotServices.findTimeSlotById(req.params.id)

        if (!timeSlot) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(200).json({
            status: 'success',
            data: timeSlot
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.updateTimeSlot = async (req, res) => {
    try {
        const timeSlot = await timeSlotServices.updateTimeSlot(req.params.id, req.body)

        if (!timeSlot) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(200).json({
            status: 'updated',
            data: timeSlot
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.deleteTimeSlot = async (req, res) => {
    try {
        const timeSlot = await timeSlotServices.deleteTimeSlot(req.params.id)

        if (!timeSlot) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(204).send()
    } catch (err) {
        sendError(res, err)
    }
}
