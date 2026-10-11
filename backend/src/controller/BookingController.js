const bookingServices = require('../service/BookingServices')
const catchAsync = require('../utils/CatchAsyns')
const AppError = require('../utils/AppError')

exports.createBooking = catchAsync(async (req, res, next) => {
    const bookingData = {
        userId: req.user.id,
        timeSlotId: req.body.timeSlotId,
        totalPrice: req.body.totalPrice
    }

    const booking = await bookingServices.createBooking(bookingData)

    res.status(201).json({
        status: 'created',
        data: booking
    })
})

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await bookingServices.getAllBookings()

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: bookings
    })
})

exports.getMyBookings = catchAsync(async (req, res, next) => {
    const bookings = await bookingServices.getMyBookings(req.user.id)

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: bookings
    })
})

exports.getBookingById = catchAsync(async (req, res, next) => {
    const booking = await bookingServices.findBookingById(req.params.id)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    const bookingUserId = booking.userId._id ? booking.userId._id.toString() : booking.userId.toString()
    const isOwner = bookingUserId === req.user.id.toString()

    if (!isOwner && req.user.role !== 'admin' && req.user.role !== 'pitch_owner') {
        return next(new AppError('You do not have permission to access this booking', 403))
    }

    res.status(200).json({
        status: 'success',
        data: booking
    })
})

exports.updateBooking = catchAsync(async (req, res, next) => {
    const booking = await bookingServices.updateBooking(req.params.id, req.body)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    res.status(200).json({
        status: 'updated',
        data: booking
    })
})

exports.cancelBooking = catchAsync(async (req, res, next) => {
    const booking = await bookingServices.cancelBooking(req.params.id, req.user)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'Booking cancelled successfully',
        data: booking
    })
})