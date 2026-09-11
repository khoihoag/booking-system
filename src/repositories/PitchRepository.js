const Pitch = require('./../models/PitchModel')


exports.create = async (data) => {
    const newPitch = await Pitch.create(data)

    return newPitch
}

exports.findAll = async () => {
    const pitchs = await Pitch.find()

    return pitchs
}


exports.findById = async (id) => {
    const pitch = await Pitch.findById(id)

    return pitch
}

exports.update = async (id, data) => {
    const newPitch = await Pitch.findByIdAndUpdate(id, data, {
        returnDocument: 'after'
    })

    return newPitch
}

exports.delete = async (id) => {
    await Pitch.findByIdAndDelete(id)
}