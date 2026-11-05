const TimeSlot = require('./../models/TimeSlotModel');

exports.create = async (data) => {
    return TimeSlot.create(data);
};

exports.findAll = async () => {
    return TimeSlot.find().populate('pitchId');
};

exports.findById = async (id) => {
    return TimeSlot.findById(id).populate('pitchId');
};

// Tìm nhiều TimeSlot theo danh sách ID
exports.findByIds = async (ids) => {
    return TimeSlot.find({
        _id: { $in: ids }
    }).populate('pitchId');
};

// Cập nhật trạng thái nhiều TimeSlot
exports.updateMany = async (ids, data) => {
    return TimeSlot.updateMany(
        {
            _id: { $in: ids },
            status: 'available'
        },
        {
            $set: data
        }
    );
};

exports.update = async (id, data) => {
    const timeSlot = await TimeSlot.findById(id);

    if (!timeSlot) {
        return null;
    }

    Object.assign(timeSlot, data);
    return timeSlot.save();
};

exports.delete = async (id) => {
    return TimeSlot.findByIdAndDelete(id);
};