const pitchRepository = require('./../repositories/PitchRepository')

exports.createPitch = async (data) => {
    return pitchRepository.create(data)
}

exports.findAllPitches = async () => {
    return pitchRepository.findByFilter({})
}

exports.findByOwner = async (ownerId) => {
    return pitchRepository.findByFilter({ ownerId })
}

exports.findPitchById = async (id) => {
    return pitchRepository.findOne({_id: id})
}

exports.updatePitch = async (id, data) => {
    return pitchRepository.update(id, data)
}

exports.deletePitch = async (id) => {
    return pitchRepository.delete(id)
}
