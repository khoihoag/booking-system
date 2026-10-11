const userServices = require('../../src/service/UserServices');
const userRepository = require('../../src/repositories/UserRepository');
const AppError = require('../../src/utils/AppError');

jest.mock('../../src/repositories/UserRepository');

describe('UserServices - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should filter allowed fields and create user', async () => {
            const reqBody = { name: 'User 1', email: 'test@example.com', password: '123', password_confirm: '123', role: 'user', extra: 'bad' };
            const filteredBody = { name: 'User 1', email: 'test@example.com', password: '123', password_confirm: '123', role: 'user' };
            const mockUser = { _id: 'u_1', ...filteredBody };
            
            userRepository.create.mockResolvedValue(mockUser);

            const result = await userServices.createUser(reqBody);

            expect(userRepository.create).toHaveBeenCalledWith(filteredBody);
            expect(result).toEqual(mockUser);
        });
    });

    describe('updateUser', () => {
        it('should throw error if trying to update password', async () => {
            const reqBody = { name: 'Updated', password: '123' };
            
            await expect(userServices.updateUser('u_1', reqBody))
                .rejects
                .toThrow(new AppError('Can not update password', 400));
        });

        it('should throw error if user not found', async () => {
            const reqBody = { name: 'Updated' };
            userRepository.update.mockResolvedValue(null);

            await expect(userServices.updateUser('u_unknown', reqBody))
                .rejects
                .toThrow(new AppError('No user found with that ID', 404));
        });

        it('should filter fields and update user successfully', async () => {
            const reqBody = { name: 'Updated', role: 'admin', extra: 'bad' };
            const filteredBody = { name: 'Updated', role: 'admin' };
            const mockUser = { _id: 'u_1', ...filteredBody };

            userRepository.update.mockResolvedValue(mockUser);

            const result = await userServices.updateUser('u_1', reqBody);

            expect(userRepository.update).toHaveBeenCalledWith('u_1', filteredBody);
            expect(result).toEqual(mockUser);
        });
    });

    describe('updateData', () => {
        it('should throw error if trying to update password', async () => {
            const reqBody = { password: '123' };
            
            await expect(userServices.updateData('u_1', reqBody))
                .rejects
                .toThrow(new AppError('This route is not for password updates. Please use /updatePassword', 400));
        });

        it('should throw error if user not found', async () => {
            const reqBody = { name: 'Updated' };
            userRepository.update.mockResolvedValue(null);

            await expect(userServices.updateData('u_unknown', reqBody))
                .rejects
                .toThrow(new AppError('No user found with that ID', 404));
        });

        it('should update user successfully (only name and email)', async () => {
            const reqBody = { name: 'Updated', role: 'admin' };
            const filteredBody = { name: 'Updated' }; // role should not be updated via updateData
            const mockUser = { _id: 'u_1', ...filteredBody };

            userRepository.update.mockResolvedValue(mockUser);

            const result = await userServices.updateData('u_1', reqBody);

            expect(userRepository.update).toHaveBeenCalledWith('u_1', filteredBody);
            expect(result).toEqual(mockUser);
        });
    });

    describe('deleteUser', () => {
        it('should delete user by ID', async () => {
            userRepository.delete.mockResolvedValue(true);

            const result = await userServices.deleteUser('u_1');

            expect(userRepository.delete).toHaveBeenCalledWith('u_1');
            expect(result).toBe(true);
        });
    });
});
