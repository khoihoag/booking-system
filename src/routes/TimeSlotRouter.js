const express = require('express')
const timeSlotController = require('./../controller/TimeSlotController')

const router = express.Router()

router.route('/').get(timeSlotController.getAllTimeSlots).post(timeSlotController.createTimeSlot)
router.route('/:id').get(timeSlotController.getTimeSlotById).delete(timeSlotController.deleteTimeSlot).patch(timeSlotController.updateTimeSlot)

module.exports = router