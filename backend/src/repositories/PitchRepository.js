const Pitch = require('./../models/PitchModel')


exports.create = async (data) => {
    return Pitch.create(data)
}

exports.findOne = async (filter) => {
    return await Pitch.findOne(filter).populate({
        path: 'ownerId',
        select: ['name', 'email', '-_id']
    })
}

exports.findByFilter = async (filter = {}) => {
    return await Pitch.find(filter).populate({
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
