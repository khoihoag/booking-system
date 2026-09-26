const Pitch = require('./../models/PitchModel')


exports.create = async (data) => {
    return Pitch.create(data)
}

exports.findAll = async () => {
    return Pitch.find().populate({
        path: 'ownerId',
        select: ['name', 'email', '-_id']
    })
}

exports.findById = async (id) => {
    return Pitch.findById(id).populate({
        path: 'ownerId',
        select: ['name', 'email', '-_id']
    })
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
