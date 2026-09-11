const pitchServices = require('./../service/PitchServices')

const sendError = (res, err) => {
    const statusCode = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500

    return res.status(statusCode).json({
        status: 'error',
        message: err.message
    })
}

exports.createPitch = async (req, res) => {
    try {
        const pitch = await pitchServices.createPitch(req.body)

        res.status(201).json({
            status: 'created',
            data: pitch
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.getAllPitches = async (req, res) => {
    try {
        const pitches = await pitchServices.findAllPitches()

        res.status(200).json({
            status: 'success',
            data: pitches
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.getPitchById = async (req, res) => {
    try {
        const pitch = await pitchServices.findPitchById(req.params.id)

        if (!pitch) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(200).json({
            status: 'success',
            data: pitch
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.updatePitch = async (req, res) => {
    try {
        const pitch = await pitchServices.updatePitch(req.params.id, req.body)

        if (!pitch) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(200).json({
            status: 'updated',
            data: pitch
        })
    } catch (err) {
        sendError(res, err)
    }
}

exports.deletePitch = async (req, res) => {
    try {
        const pitch = await pitchServices.deletePitch(req.params.id)

        if (!pitch) {
            return res.status(404).json({ status: 'not found' })
        }

        res.status(204).send()
    } catch (err) {
        sendError(res, err)
    }
}
