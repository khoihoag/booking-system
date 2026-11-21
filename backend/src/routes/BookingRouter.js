const express = require('express')

const bookingController = require('../controller/BookingController')
const authController = require('../controller/AuthController')

const router = express.Router()

// Mọi route booking đều cần đăng nhập
router.use(authController.protect)

router.get('/my-bookings', bookingController.getMyBookings)
router.post('/:id/confirm-payment', bookingController.confirmPayment)
router.post('/:id/refund', bookingController.refundBooking)
router.post('/:id/complete', bookingController.completeBooking)

router.route('/')
    .get(authController.restrictTo('admin'), bookingController.getAllBookings)
    .post(bookingController.createBooking)

router.route('/:id')
    .get(bookingController.getBookingById)
    .patch(bookingController.updateBooking)
    .delete(bookingController.cancelBooking)
module.exports = router
