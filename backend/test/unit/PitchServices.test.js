const pitchServices = require('../../src/service/PitchServices');
const pitchRepository = require('../../src/repositories/PitchRepository');

jest.mock('../../src/repositories/PitchRepository');

describe('PitchServices - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPitch', () => {
        it('should call pitchRepository.create with correct data', async () => {
            const mockData = { name: 'Pitch 1', address: 'Hanoi' };
            const mockResult = { _id: 'pitch_123', ...mockData };
            pitchRepository.create.mockResolvedValue(mockResult);

            const result = await pitchServices.createPitch(mockData);

            expect(pitchRepository.create).toHaveBeenCalledWith(mockData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('findAllPitches', () => {
        it('should return all pitches', async () => {
            const mockPitches = [{ _id: '1', name: 'Pitch 1' }, { _id: '2', name: 'Pitch 2' }];
            pitchRepository.findByFilter.mockResolvedValue(mockPitches);

            const result = await pitchServices.findAllPitches();

            expect(pitchRepository.findByFilter).toHaveBeenCalledWith({});
            expect(result).toEqual(mockPitches);
        });
    });

    describe('findByOwner', () => {
        it('should return pitches by owner ID', async () => {
            const mockPitches = [{ _id: '1', ownerId: 'owner_1' }];
            pitchRepository.findByFilter.mockResolvedValue(mockPitches);

            const result = await pitchServices.findByOwner('owner_1');

            expect(pitchRepository.findByFilter).toHaveBeenCalledWith({ ownerId: 'owner_1' });
            expect(result).toEqual(mockPitches);
        });
    });

    describe('findPitchById', () => {
        it('should return pitch by ID', async () => {
            const mockPitch = { _id: 'pitch_123', name: 'Pitch 1' };
            pitchRepository.findOne.mockResolvedValue(mockPitch);

            const result = await pitchServices.findPitchById('pitch_123');

            expect(pitchRepository.findOne).toHaveBeenCalledWith({ _id: 'pitch_123' });
            expect(result).toEqual(mockPitch);
        });
    });

    describe('updatePitch', () => {
        it('should call update and return updated pitch', async () => {
            const mockData = { name: 'Pitch Updated' };
            const mockResult = { _id: 'pitch_123', ...mockData };
            pitchRepository.update.mockResolvedValue(mockResult);

            const result = await pitchServices.updatePitch('pitch_123', mockData);

            expect(pitchRepository.update).toHaveBeenCalledWith('pitch_123', mockData);
            expect(result).toEqual(mockResult);
        });
    });

    describe('deletePitch', () => {
        it('should call delete and return result', async () => {
            pitchRepository.delete.mockResolvedValue(true);

            const result = await pitchServices.deletePitch('pitch_123');

            expect(pitchRepository.delete).toHaveBeenCalledWith('pitch_123');
            expect(result).toBe(true);
        });
    });
});
