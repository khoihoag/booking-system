const timeSlotServices = require('../../src/service/TimeSlotServices');
const timeSlotRepository = require('../../src/repositories/TimeSlotRepository');

jest.mock('../../src/repositories/TimeSlotRepository');

describe('TimeSlotServices - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTimeSlot', () => {
        it('should call create and return timeslot', async () => {
            const mockData = { pitchId: 'pitch_1', price: 100 };
            const mockResult = { _id: 'ts_1', ...mockData };
            timeSlotRepository.create.mockResolvedValue(mockResult);

            const result = await timeSlotServices.createTimeSlot(mockData);

            expect(timeSlotRepository.create).toHaveBeenCalledWith(mockData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('findAllTimeSlots', () => {
        it('should return all timeslots', async () => {
            const mockList = [{ _id: 'ts_1' }, { _id: 'ts_2' }];
            timeSlotRepository.findAll.mockResolvedValue(mockList);

            const result = await timeSlotServices.findAllTimeSlots();

            expect(timeSlotRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockList);
        });
    });

    describe('findTimeSlotById', () => {
        it('should return timeslot by ID', async () => {
            const mockTs = { _id: 'ts_1' };
            timeSlotRepository.findById.mockResolvedValue(mockTs);

            const result = await timeSlotServices.findTimeSlotById('ts_1');

            expect(timeSlotRepository.findById).toHaveBeenCalledWith('ts_1');
            expect(result).toEqual(mockTs);
        });
    });

    describe('updateTimeSlot', () => {
        it('should call update and return result', async () => {
            const mockData = { price: 200 };
            const mockResult = { _id: 'ts_1', ...mockData };
            timeSlotRepository.update.mockResolvedValue(mockResult);

            const result = await timeSlotServices.updateTimeSlot('ts_1', mockData);

            expect(timeSlotRepository.update).toHaveBeenCalledWith('ts_1', mockData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('deleteTimeSlot', () => {
        it('should call delete and return result', async () => {
            timeSlotRepository.delete.mockResolvedValue(true);

            const result = await timeSlotServices.deleteTimeSlot('ts_1');

            expect(timeSlotRepository.delete).toHaveBeenCalledWith('ts_1');
            expect(result).toBe(true);
        });
    });
});
