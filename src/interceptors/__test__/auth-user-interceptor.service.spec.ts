/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/tslint/config */

import { ExecutionContext } from '@nestjs/common';
import { mocked } from 'ts-jest/utils';

import { AuthUserInterceptor } from '../auth-user-interceptor.service';

jest.mock('../../modules/auth/auth.service');

const mockUser = { id: 1, username: 'john' };

const createMockedExecutionContext = () =>
    mocked(({
        switchToHttp: jest.fn(() => ({
            getRequest: jest.fn(() => ({
                user: mockUser,
            })),
        })),
    } as unknown) as ExecutionContext);

describe('AuthUserInterceptorService', () => {
    it('should set auth user on request', async () => {
        const { AuthService } = await import('../../modules/auth/auth.service');
        const setAuthUser = jest.fn();

        (AuthService.setAuthUser as jest.Mock).mockImplementation(setAuthUser);

        const interceptor = new AuthUserInterceptor();
        const ctx = createMockedExecutionContext() as any;
        const next = mocked({
            handle: jest.fn(),
        });

        interceptor.intercept(ctx, next);

        expect(next.handle).toBeCalledTimes(1);
        expect(setAuthUser).toBeCalledWith(mockUser);
    });
});
