import {JwtService} from '@nestjs/jwt';
import {Test} from '@nestjs/testing';

import {RoleType} from '../../../common/constants/role-type';
import {UtilsService} from '../../../providers/utils.service';
import {ConfigService} from '../../../shared/services/config.service';
import {UserDto} from '../../user/dto/UserDto';
import {UserEntity} from '../../user/user.entity';
import {UserService} from '../../user/user.service';
import {AuthService} from '../auth.service';
import {TokenPayloadDto} from '../dto/TokenPayloadDto';
import {UserLoginDto} from '../dto/UserLoginDto';
import {UserLoginGoogleDto} from '../dto/UserLoginGoogleDto';
import {UserNotFoundException} from "../../../exceptions/user-not-found.exception";
import {userEntity} from "./auth.controller.spec";

const mockUserGoogle: UserLoginGoogleDto = {
    email: 'test@gmail.com',
    name: 'test user',
    verified: true,
};

const mockUser: UserDto = {
    id: '1',
    email: 'test@gmail.com',
    name: 'test user',
    role: RoleType.USER,
};

const mockUserLoginDto: UserLoginDto = {
    email: 'test@gmail.com',
    password: '123',
};

const mockJwtService = () => ({
    signAsync: jest.fn(),
});

const mockConfigService = () => ({
    getNumber: jest.fn(),
});

const mockUserService = () => ({
    findByUsernameOrEmail: jest.fn(),
    createUserForGoogle: jest.fn(),
    createUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
});

const mockUtilsService = () => ({
    validateHash: jest.fn(),
});

describe('AuthService', () => {
    let authService;
    let jwtService;
    let configService;
    let userService;
    let utilsService;

    beforeEach(async () => {
        UtilsService.validateHash = jest.fn().mockResolvedValue(true);
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {provide: UserService, useFactory: mockUserService},
                {provide: UtilsService, useFactory: mockUtilsService},
                {provide: JwtService, useFactory: mockJwtService},
                {provide: ConfigService, useFactory: mockConfigService},
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        userService = module.get<UserService>(UserService);
        utilsService = module.get<UtilsService>(UtilsService);
    });

    describe('validateUser', () => {
        it('validateUser returns user from the auth service', async () => {
            const expectedResult: UserEntity = {
                id: '1',
                name: 'example',
                role: RoleType.USER,
                email: 'example@fresco.com',
                password: '123',
                verified: false,
                googleId: null,
                createdAt: new Date(),
                dtoClass: UserDto,
                toDto: () => '',
            };

            userService.findOne.mockReturnValue(expectedResult);
            const result = await authService.validateUser(mockUserLoginDto);
            expect(result).toEqual(expectedResult);
        });
        it('validateUser throws UserNotFoundException', async () => {
            const expectedResult: UserEntity = {
                id: '1',
                name: 'example',
                role: RoleType.USER,
                email: 'example@fresco.com',
                password: '1234',
                verified: false,
                googleId: null,
                createdAt: new Date(),
                dtoClass: UserDto,
                toDto: () => '',
            };

            userService.findOne.mockReturnValue(undefined);

            await expect(
                authService.validateUser(mockUserLoginDto),
            ).rejects.toThrow(new UserNotFoundException());
        });
    });

    describe('createToken', () => {
        it('createToken from the auth service', async () => {
            const expectedResult: TokenPayloadDto = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };

            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            const result = await authService.createToken(mockUser);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('setAuthUser', () => {
        it('called', async () => {
            try {
                AuthService.setAuthUser(userEntity)
            } catch (e) {
            }
        });
    });

    describe('getAuthUser', () => {
        it('called', async () => {
            try {
                AuthService.getAuthUser()
            } catch (e) {
            }
        });
    });

    describe('createVerifyUser', () => {
        it('called', async () => {
            userService.createUser.mockReturnValue(userEntity);
            let result = await authService.createVerifyUser(userEntity)

            expect(result).toEqual(userEntity)
        });
    });

    describe('validateOAuthLoginEmail', () => {
        it('find an email from user service', async () => {
            const expectedResult = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };
            userService.findByUsernameOrEmail.mockResolvedValue({
                id: '3731dc00-e5e9-4069-bc64-9e59a5e9795b',
            }); // or mockReturnValue, mockRejectedValue
            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            expect(userService.findByUsernameOrEmail).not.toHaveBeenCalled();
            // class authService.validateOAuthLoginEmail
            const result = await authService.validateOAuthLoginEmail(
                mockUserGoogle.email,
                mockUserGoogle,
            );
            // expect authService.validateOAuthLoginEmail TO HAVE BEEN CALLED
            expect(userService.createUserForGoogle).not.toHaveBeenCalled();
            expect(userService.findByUsernameOrEmail).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('email not found from user service', async () => {
            const expectedResult = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };
            userService.findByUsernameOrEmail.mockResolvedValue(null);
            userService.createUserForGoogle.mockResolvedValue({
                id: 'testId',
            });
            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            expect(userService.findByUsernameOrEmail).not.toHaveBeenCalled();
            expect(userService.createUserForGoogle).not.toHaveBeenCalled();

            const result = await authService.validateOAuthLoginEmail(
                mockUserGoogle.email,
                mockUserGoogle,
            );

            expect(userService.createUserForGoogle).toHaveBeenCalled();
            expect(userService.findByUsernameOrEmail).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('do nothing for already user already registered by google oauth', async () => {
            const expectedResult = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };
            userService.findByUsernameOrEmail.mockResolvedValue({
                id: '3731dc00-e5e9-4069-bc64-9e59a5e9795b',
                googleId: 'aaaaa',
            } as any);
            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            expect(userService.findByUsernameOrEmail).not.toHaveBeenCalled();
            expect(userService.createUserForGoogle).not.toHaveBeenCalled();

            const result = await authService.validateOAuthLoginEmail(
                mockUserGoogle.email,
                mockUserGoogle,
            );

            expect(userService.createUserForGoogle).not.toHaveBeenCalled();
            expect(userService.findByUsernameOrEmail).toHaveBeenCalled();
            expect(userService.update).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});
