const pitchRepository = require('./../repositories/PitchRepository')

exports.createPitch = async (data) => {
    const newPitch = await pitchRepository.create(data)

    return newPitch
}

exports.findAllPitches = async () => {
    const pitchs = await pitchRepository.findAll()

    return pitchs
}

exports.findPitchById = async (id) => {
    const pitch = pitchRepository.findById(id)

    return pitch
}

exports.updatePitch = async (data) => {
    await pitchRepository.update(data)
}

exports.deletePitch = async (id) => {
    await pitchRepository.delete(id)
}


