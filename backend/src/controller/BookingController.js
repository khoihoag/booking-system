const bookingServices = require('../service/BookingServices')
const catchAsync = require('../utils/CatchAsyns')
const AppError = require('../utils/AppError')

exports.createBooking = catchAsync(async (req, res, next) => {
    const bookingData = {
        userId: req.user._id,
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
    const bookings = await bookingServices.getMyBookings(req.user._id)

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: bookings
    })
})

exports.getBookingById = catchAsync(async (req, res, next) => {
    const bookingId = req.params.id || req.params._id
    const booking = await bookingServices.findBookingById(bookingId)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    const bookingUserId = booking.userId?._id ? booking.userId._id.toString() : booking.userId?.toString()
    const currentUserId = (req.user._id || req.user.id)?.toString()
    const isOwner = bookingUserId && currentUserId && bookingUserId === currentUserId

    if (!isOwner && req.user.role !== 'admin' && req.user.role !== 'pitch_owner') {
        return next(new AppError('You do not have permission to access this booking', 403))
    }

    res.status(200).json({
        status: 'success',
        data: booking
    })
})

exports.updateBooking = catchAsync(async (req, res, next) => {
    const bookingId = req.params.id || req.params._id
    const booking = await bookingServices.updateBooking(bookingId, req.body)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    res.status(200).json({
        status: 'updated',
        data: booking
    })
})

exports.cancelBooking = catchAsync(async (req, res, next) => {
    const bookingId = req.params.id || req.params._id
    const booking = await bookingServices.cancelBooking(bookingId, req.user)

    if (!booking) {
        return next(new AppError('No booking found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'Booking cancelled successfully',
        data: booking
    })
})