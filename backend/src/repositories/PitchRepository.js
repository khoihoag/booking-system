const Pitch = require('./../models/PitchModel')
const mongoose = require('mongoose')

exports.create = async (data) => {
    return Pitch.create(data)
}

exports.findOne = async (filter) => {
    let queryFilter = filter
    if (filter && filter._id && !mongoose.Types.ObjectId.isValid(filter._id)) {
        queryFilter = { id: filter._id }
    }
    return await Pitch.findOne(queryFilter).populate({
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
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id }
    const pitch = await Pitch.findOne(filter)

    if (!pitch) {
        return null
    }

    Object.assign(pitch, data)
    return pitch.save()
}

exports.delete = async (id) => {
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id }
    return Pitch.findOneAndDelete(filter)
}
