// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { AuthRepository } from '../../src/components/auth/repositories/AuthRepository';
// import { AuthService } from '../../src/components/auth/services/OnboardingService';
// import { BadRequestError } from '../../src/library/helpers';
// import { Auth } from '../../src/components/auth/model/Auth';
// import { IAuth } from '../../src/types/auth/IAuth';

// jest.mock('../../src/components/auth/repositories/AuthRepository');
// jest.mock('bcryptjs', () => ({
//   // Mocking hash method with the correct type
//   hash: jest.fn().mockResolvedValue('hashedPassword') as jest.Mock<Promise<string>, [string, number]>,
// }));
// jest.mock('jsonwebtoken', () => ({
//   sign: jest.fn(),
// }));

// // Factory function to create mock Auth objects
// const createMockAuth = (overrides: Partial<IAuth> = {}): Auth => {
//   const defaultAuth: IAuth = {
//     id: '1',
//     email: 'test@test.com',
//     password: 'hashedPassword',
//     role: 'user',
//     name: 'Test User',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     resetPasswordToken: null,
//     resetPasswordExpires: null,
//     otp: null,
//     otpExpires: null,
//   };

//   const mockAuth = {
//     ...defaultAuth,
//     ...overrides,

//     _attributes: {},
//     dataValues: {},
//     isNewRecord: false,
//     sequelize: {} as any,
//     where: {} as any,
//     getDataValue: jest.fn(),
//     setDataValue: jest.fn(),
//   };

//   return mockAuth as any;
// };

// describe('AuthService.signUp', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should throw an error if the user already exists', async () => {
//     jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(createMockAuth());

//     await expect(
//       AuthService.signUp({
//         email: 'test@test.com',
//         password: 'password123',
//         role: 'user',
//         name: 'Test User',
//       }),
//     ).rejects.toThrow(BadRequestError);
//   });

//   it('should create a new user and return auth response', async () => {
//     jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(null);
//     jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

//     jest.spyOn(AuthRepository, 'createUser').mockResolvedValue(
//       createMockAuth({
//         email: 'new@test.com',
//         password: 'hashedPassword',
//         name: 'New User',
//       }),
//     );

//     jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken');

//     const result = await AuthService.signUp({
//       email: 'new@test.com',
//       password: 'password123',
//       role: 'user',
//       name: 'New User',
//     });

//     expect(result).toEqual({
//       email: 'new@test.com',
//       role: 'user',
//       name: 'New User',
//       token: 'mockToken',
//     });
//   });

//   it('should hash the password with bcrypt', async () => {
//     jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(null);
//     const bcryptSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
//     jest.spyOn(AuthRepository, 'createUser').mockResolvedValue(createMockAuth({ password: 'hashedPassword' }));
//     jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken');

//     await AuthService.signUp({
//       email: 'new@test.com',
//       password: 'password123',
//       role: 'user',
//       name: 'New User',
//     });

//     expect(bcryptSpy).toHaveBeenCalledWith('password123', 10);
//   });

//   it('should call jwt.sign with the correct payload', async () => {
//     jest.spyOn(AuthRepository, 'findByEmail').mockResolvedValue(null);
//     // jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
//     jest.spyOn(AuthRepository, 'createUser').mockResolvedValue(
//       createMockAuth({
//         email: 'new@test.com',
//         password: 'hashedPassword',
//         name: 'New User',
//       }),
//     );
//     const jwtSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken');

//     await AuthService.signUp({
//       email: 'new@test.com',
//       password: 'password123',
//       role: 'user',
//       name: 'New User',
//     });

//     expect(jwtSpy).toHaveBeenCalledWith({ id: '1', email: 'new@test.com', role: 'user' }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//   });
// });
