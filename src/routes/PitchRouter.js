const express = require('express')

const pitchController = require('../controller/PitchController')

const router = express.Router()

router.route('/').get(pitchController.getAllPitches).post(pitchController.createPitch)

router.route('/:id').get(pitchController.getPitchById).delete(pitchController.deletePitch).patch(pitchController.updatePitch)

module.exports = router