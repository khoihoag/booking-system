const authServices = require('../../src/service/AuthServices');
const userRepository = require('../../src/repositories/UserRepository');
const AppError = require('../../src/utils/AppError');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/UserRepository');
jest.mock('jsonwebtoken');

describe('AuthServices - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '90d';
    });

    describe('signup', () => {
        it('should create user and return token', async () => {
            const userData = { name: 'Test', email: 'test@example.com', password: '123', password_confirm: '123' };
            const mockUser = { _id: 'u_1', ...userData };
            
            userRepository.create.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mocked_token');

            const result = await authServices.signup(userData);

            expect(userRepository.create).toHaveBeenCalledWith(userData);
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'u_1' }, 'test-secret', { expiresIn: '90d' });
            expect(result).toEqual({ user: mockUser, token: 'mocked_token' });
        });
    });

    describe('login', () => {
        it('should throw error if email or password missing', async () => {
            await expect(authServices.login('test@example.com', null))
                .rejects
                .toThrow(new AppError('Please provide email and password', 400));
        });

        it('should throw error if user not found or wrong password', async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            await expect(authServices.login('test@example.com', 'wrong_pass'))
                .rejects
                .toThrow(new AppError('Incorrect email or password', 401));
        });

        it('should login successfully and return token', async () => {
            const mockUser = {
                _id: 'u_1',
                email: 'test@example.com',
                password: 'hashed_password',
                correctPassword: jest.fn().mockResolvedValue(true)
            };
            
            userRepository.findByEmail.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('mocked_token');

            const result = await authServices.login('test@example.com', '123');

            expect(mockUser.correctPassword).toHaveBeenCalledWith('123', 'hashed_password');
            expect(result.token).toBe('mocked_token');
            expect(result.user.password).toBeUndefined(); // Should hide password
        });
    });
});
