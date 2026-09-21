const express = require('express')

const userController = require('./../controller/UserController')
const authController = require('./../controller/AuthController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
router.patch('updateData', authController.protect, Use)

router.patch('/updatePassword', authController.protect, authController.updatePassword)


router.route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUserById)
    .delete(authController.protect, authController.restrictTo('admin'),userController.deleteUser)
    .patch(userController.updateUser)


module.exports = router