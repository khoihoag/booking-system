const express = require('express')

const userController = require('../controller/UserController')
const authController = require('../controller/AuthController')
const pitchController = require('./../controller/PitchController')

const router = express.Router()

// Công khai
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// Yêu cầu: Đăng Nhập
router.use(authController.protect)

router.get('/me', userController.getMe)
router.patch('/updateData', userController.updateData)
router.patch('/updatePassword', authController.updatePassword)
router.delete('/deleteMe', userController.deleteMe)

router.get('/my-pitches', authController.protect, authController.restrictTo('pitch_owner'), pitchController.getPitchesByUser)

// Yêu cầu: ADMIN
router.use(authController.restrictTo('admin'))
router.route('/')
            .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUserById)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)

module.exports = router

// TODO: 