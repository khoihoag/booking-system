const pitchRepository = require('./../repositories/PitchRepository')

exports.createPitch = async (data) => {
    return pitchRepository.create(data)
}

exports.findAllPitches = async () => {
    return pitchRepository.findAll()
}

exports.findPitchById = async (id) => {
    return pitchRepository.findById(id)
}

exports.updatePitch = async (id, data) => {
    return pitchRepository.update(id, data)
}

exports.deletePitch = async (id) => {
    return pitchRepository.delete(id)
}
