const Pitch = require('./../models/PitchModel')


exports.create = async (data) => {
    const newPitch = await Pitch.create(data)

    return newPitch
}

exports.findAllPitchs = async () => {
    const pitchs = await Pitch.find()

    return pitchs
}


exports.findPitch = async (id) => {
    const pitch = await Pitch.findById(id)

    return pitch
}

exports.updatePitch = async (id, data) => {
    const newPitch = await Pitch.findByIdAndUpdate(id, data, {
        returnDocument: 'after'
    })

    return newPitch
}

exports.deletePitch = async (id) => {
    await Pitch.findByIdAndDelete(id)
}