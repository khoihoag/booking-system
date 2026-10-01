const express = require('express')

const pitchController = require('../controller/PitchController')
const authController = require('./../controller/AuthController')

const router = express.Router()

router.route('/')
    .get(pitchController.getAllPitches)
    .post(
        authController.protect, 
        authController.restrictTo('pitch_owner'), 
        pitchController.createPitch
    )

router.route('/:id')
    .get(pitchController.getPitchById)
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'pitch_owner'), 
        pitchController.deletePitch
    )
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'pitch_owner'), 
        pitchController.updatePitch
    )

module.exports = router


/*
get     /           user, owner, admin
GET     /:id        user, owner, admin
POST    /                 owner

*/