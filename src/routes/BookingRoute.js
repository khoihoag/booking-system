const express = require('express')

const authController = require('./../controller/AuthController')
const bookingController = require('./../controller/BookingController')

const router = express.Router()

router.use(authController.protect)

router.route('/my-bookings')
    .get()

router.route('/')
    .post(bookingController.createBooking)

