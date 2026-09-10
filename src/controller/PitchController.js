const pitchServices = require('./../service/PitchServices')

exports.createField = (req, res) => {

}

exports.getAllPitch = (req, res) => {
    try {
        const pitchs = pitchServices.findAllPitch(req.body)
    
        res.status(201).json(pitchs)    
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    }
}

exports.getPitchById = (req, res) => {
    try {
        const pitch = pitchServices.findPitchById(req.params.id)
        
        res.status(201).json(pitch)
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}

exports.updatePitch = (req, res) => {
    try {
        pitchServices.updatePitchById(req.params.id, req.body)
        
        res.status(201)
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}

exports.deletePitch = (req, res) => {
    try {
        pitchServices.deletePitchById(req.params.id)
        
        res.status(201).json(pitch)
    } catch (err) {
        res.status(404).json(
            console.log(err)
        )
    } 
}