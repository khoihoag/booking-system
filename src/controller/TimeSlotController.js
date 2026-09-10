exports.createTimeSlot = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'create'
    })
}

exports.getAllTimeSlots = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'Get All'
    })
}

exports.getTimeSlotById = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            id: req.params.id
        }
    })
}

exports.updateTimeSlot = (req, res) => {
    res.status(200).json({
        status: 'success',
        id: req.params.id,
        data: 'UPDATING....'
    })
}

exports.deleteTimeSlot = (req, res) => {
    res.status(200).json({
        status: 'success',
        id: req.params.id,
        data: 'DELETE....'
    })
}