const Pitch = require('./../models/PitchModel')


exports.create = async (data) => {
    return Pitch.create(data)
}

exports.findAll = async () => {
    return Pitch.find().populate('users')
}

exports.findById = async (id) => {
    return Pitch.findById(id).populate('users')
}

exports.update = async (id, data) => {
    const pitch = await Pitch.findById(id)

    if (!pitch) {
        return null
    }

    Object.assign(pitch, data)
    return pitch.save()
}

exports.delete = async (id) => {
    return Pitch.findByIdAndDelete(id)
}
