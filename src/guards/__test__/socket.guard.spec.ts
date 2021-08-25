import { mocked } from 'ts-jest/utils';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { SocketGuard } from '../socket.guard';
import { UserService } from '../../modules/user/user.service';
import { ConfigService } from '../../shared/services/config.service';
import { WsException } from '@nestjs/websockets';
import { ExecutionContext } from '@nestjs/common';

const createMockedExecutionContext = (token: string) =>
    mocked(({
        switchToWs: jest.fn(() => ({
            getClient: jest.fn(() => ({
                handshake: token ? { query: { token } } : null,
            })),
        })),
        switchToHttp: jest.fn(() => ({
            getRequest: jest.fn(() => ({
                user: null,
            })),
        })),
    } as unknown) as ExecutionContext);

const mockConfigService = mocked({
    get: jest.fn(),
});

const mockUserService = mocked({
    findOne: jest.fn(),
});

describe('SocketGuard', () => {
    let socketGuard: SocketGuard;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                { provide: ConfigService, useValue: mockConfigService },
                { provide: UserService, useValue: mockUserService },
                SocketGuard,
            ],
        }).compile();

        socketGuard = module.get(SocketGuard);
    });

    it('should authorize user by handshake token', async () => {
        const secret = 'secret_key';
        const user = { id: 1 };

        mockConfigService.get.mockImplementation(() => secret);
        mockUserService.findOne.mockImplementation(() => user);

        const token = jwt.sign(user, secret);
        const ctx = createMockedExecutionContext(token);

        await expect(socketGuard.canActivate(ctx as any)).resolves.toBe(true);
        const httpCtx = ctx.switchToHttp.mock.results[0].value;
        const request = httpCtx.getRequest.mock.results[0].value;
        expect(request.user).toEqual(user);
    });

    it('should throw WsException if token not provided', async () => {
        const ctx = createMockedExecutionContext(null);

        await expect(socketGuard.canActivate(ctx as any)).rejects.toThrow(
            new WsException('Missing token'),
        );
    });

    it('should throw WsException if user does not exist on database', async () => {
        const secret = 'secret_key';
        const user = { id: 1 };

        mockConfigService.get.mockImplementation(() => secret);
        mockUserService.findOne.mockImplementation(() => null);

        const token = jwt.sign(user, secret);
        const ctx = createMockedExecutionContext(token) as any;

        await expect(socketGuard.canActivate(ctx)).rejects.toThrow(
            new WsException('Token not valid'),
        );
    });

    it('should throw WsException if error occurred while verifying token', async () => {
        const secret = 'secret_key';

        mockConfigService.get.mockImplementation(() => secret);
        mockUserService.findOne.mockImplementation(() => null);

        const ctx = createMockedExecutionContext('invalid token') as any;

        await expect(socketGuard.canActivate(ctx)).rejects.toThrow(
            new WsException('jwt malformed'),
        );
    });
});
