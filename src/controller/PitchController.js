const pitchServices = require('./../service/PitchServices')
const Pitch = require('./../models/PitchModel')

exports.createPitch = async (req, res) => {
    try {
        await pitchServices.createPitch(req.body)

        res.status(201).json({
            status: 'created ....'
        })
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    }

}

exports.getAllPitches = async (req, res) => {
    try {
        // console.log(1)
        const pitchs = await pitchServices.findAllPitches(req.body)
        
        res.status(201).json(pitchs)    
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    }
}

exports.getPitchById = async (req, res) => {
    try {
        const pitch = await pitchServices.findPitchById(req.params.id)
        
        res.status(201).json(pitch)
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}

exports.updatePitch = async (req, res) => {
    try {
        await pitchServices.updatePitch(req.params.id, req.body)
        
        res.status(201).json({
            status: 'updated ...'
        })
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}

exports.deletePitch = async (req, res) => {
    try {
        await pitchServices.deletePitch(req.params.id)
        
        res.status(201).json({
            status: 'deleted ...'
        })
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}