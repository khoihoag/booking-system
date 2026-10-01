const bookingServices = require('../../src/service/BookingServices');
const bookingRepository = require('../../src/repositories/BookingRepository');
const timeSlotRepository = require('../../src/repositories/TimeSlotRepository');
const AppError = require('../../src/utils/AppError');

jest.mock('../../src/repositories/BookingRepository');
jest.mock('../../src/repositories/TimeSlotRepository');

describe('BookingServices - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBooking', () => {
        const mockData = { timeSlotId: 'slot_123', userId: 'user_123', totalPrice: 200000 };

        it('should throw 400 if timeSlotId is missing', async () => {
            const invalidData = { userId: 'user_123' };
            await expect(bookingServices.createBooking(invalidData))
                .rejects
                .toThrow(new AppError('Please provide a timeSlotId for booking', 400));
        });

        it('should throw 404 if time slot not found', async () => {
            timeSlotRepository.findById.mockResolvedValue(null);
            await expect(bookingServices.createBooking(mockData))
                .rejects
                .toThrow(new AppError('No time slot found with that ID', 404));
        });

        it('should throw 400 if time slot is not available', async () => {
            timeSlotRepository.findById.mockResolvedValue({ _id: 'slot_123', status: 'booked' });
            await expect(bookingServices.createBooking(mockData))
                .rejects
                .toThrow(new AppError('This time slot is not available for booking', 400));
        });

        it('should create booking successfully', async () => {
            const mockTimeSlot = { _id: 'slot_123', status: 'available', price: 250000 };
            const mockCreatedBooking = { _id: 'booking_123', ...mockData, status: 'confirmed' };

            timeSlotRepository.findById.mockResolvedValue(mockTimeSlot);
            timeSlotRepository.update.mockResolvedValue(true);
            bookingRepository.create.mockResolvedValue(mockCreatedBooking);

            const result = await bookingServices.createBooking(mockData);

            expect(timeSlotRepository.update).toHaveBeenCalledWith('slot_123', { status: 'booked' });
            expect(bookingRepository.create).toHaveBeenCalledWith({
                timeSlotId: 'slot_123',
                userId: 'user_123',
                totalPrice: 200000,
                status: 'confirmed'
            });
            expect(result).toEqual(mockCreatedBooking);
        });
    });

    describe('cancelBooking', () => {
        it('should return null if booking not found', async () => {
            bookingRepository.findById.mockResolvedValue(null);
            const result = await bookingServices.cancelBooking('b_123', { id: 'u_1' });
            expect(result).toBeNull();
        });

        it('should throw 403 if user is not owner or admin', async () => {
            const mockBooking = { _id: 'b_123', userId: 'owner_id', status: 'confirmed' };
            bookingRepository.findById.mockResolvedValue(mockBooking);
            
            await expect(bookingServices.cancelBooking('b_123', { id: 'other_user', role: 'user' }))
                .rejects
                .toThrow(new AppError('You do not have permission to cancel this booking', 403));
        });

        it('should cancel booking and free up timeslot successfully', async () => {
            const mockBooking = { _id: 'b_123', userId: { _id: 'owner_id' }, timeSlotId: 'slot_123', status: 'confirmed' };
            bookingRepository.findById.mockResolvedValue(mockBooking);
            timeSlotRepository.update.mockResolvedValue(true);
            bookingRepository.update.mockResolvedValue({ ...mockBooking, status: 'cancelled' });

            const result = await bookingServices.cancelBooking('b_123', { id: 'owner_id', role: 'user' });

            expect(timeSlotRepository.update).toHaveBeenCalledWith('slot_123', { status: 'available' });
            expect(bookingRepository.update).toHaveBeenCalledWith('b_123', { status: 'cancelled' });
            expect(result.status).toBe('cancelled');
        });
    });
});
