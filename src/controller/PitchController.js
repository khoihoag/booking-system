const catchAsync = require('./../utils/CatchAsyns')
const pitchServices = require('./../service/PitchServices')
const AppError = require('./../utils/AppError')


exports.createPitch = catchAsync(async (req, res) => {
    const pitch = await pitchServices.createPitch(req.body)

    res.status(201).json({
        status: 'created',
        data: pitch
    })

})

exports.getAllPitches = catchAsync(async (req, res) => {
    const pitches = await pitchServices.findAllPitches()

    res.status(200).json({
        status: 'success',
        data: pitches
    })

})

exports.getPitchById = catchAsync(async (req, res, next) => {

    const pitch = await pitchServices.findPitchById(req.params.id)

    
    if (!pitch) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(200).json({
        status: 'success',
        data: pitch
    })
})

exports.updatePitch = catchAsync(async (req, res) => {
    const pitch = await pitchServices.updatePitch(req.params.id, req.body)

    if (!pitch) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(200).json({
        status: 'updated',
        data: pitch
    })
})

exports.deletePitch = catchAsync(async (req, res) => {

    const pitch = await pitchServices.deletePitch(req.params.id)

    if (!pitch) {
        return new AppError("No tour found with that ID", 404)
    }

    res.status(204).send()

})
