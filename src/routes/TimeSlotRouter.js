const express = require('express')
const timeSlotController = require('./../controller/TimeSlotController')
const authController = require('./../controller/AuthController')
const router = express.Router()

router.route('/')
    .get(timeSlotController.getAllTimeSlots)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'pitch_owner'), 
        timeSlotController.createTimeSlot
    )
router.route('/:id')
    .get(timeSlotController.getTimeSlotById)
    .delete (
        authController.protect, 
        authController.restrictTo('admin', 'pitch_owner'), 
        timeSlotController.deleteTimeSlot
    )
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'pitch_owner'), 
        timeSlotController.updateTimeSlot
    )

module.exports = router