import { Test } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';

import { ConfigService } from '../../../shared/services/config.service';
import { UserService } from '../../user/user.service';
import { JwtStrategy } from '../jwt.strategy';
import Mocked = jest.Mocked;
import { UserEntity } from '../../user/user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserService = () =>
    mocked({
        findOne: jest.fn(),
    });

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userService: Mocked<UserService>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                ConfigService,
                { provide: UserService, useFactory: mockUserService },
            ],
        }).compile();

        jwtStrategy = module.get(JwtStrategy);
        userService = module.get(UserService);
    });

    it('should validate request', async () => {
        const user = ({ id: 123 } as unknown) as UserEntity;
        userService.findOne.mockImplementation(() => Promise.resolve(user));

        await expect(
            jwtStrategy.validate({
                iat: Date.now(),
                exp: Date.now() + 1000,
                id: user.id,
            }),
        ).resolves.toEqual(user);
    });

    it('should throw exception if token expired', async () => {
        await expect(
            jwtStrategy.validate({
                iat: Date.now(),
                exp: Date.now() - 1000,
                id: 5,
            }),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw exception if user not found', async () => {
        userService.findOne.mockImplementation(() => Promise.resolve(null));

        await expect(
            jwtStrategy.validate({
                iat: Date.now(),
                exp: Date.now() + 1000,
                id: 5,
            }),
        ).rejects.toThrow(UnauthorizedException);
    });
});
