import { Test } from '@nestjs/testing';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RoleType } from '../../common/constants/role-type';
import { mocked } from 'ts-jest';
import { ClassType } from 'class-transformer/ClassTransformer';

const createMockedExecutionContext = (
    handler: ClassType<any>,
    userRole: RoleType,
) =>
    mocked({
        getHandler: jest.fn(() => handler),
        switchToHttp: jest.fn(() => ({
            getRequest: jest.fn(() => ({
                user: {
                    role: userRole,
                },
            })),
        })),
    });

describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RolesGuard],
        }).compile();

        rolesGuard = module.get(RolesGuard);
    });

    it('should pass roles guard', () => {
        @Roles(RoleType.ADMIN)
        class Controller {}

        const ctx = createMockedExecutionContext(Controller, RoleType.ADMIN);

        const canActivate = rolesGuard.canActivate(ctx as any);
        expect(canActivate).toBe(true);
    });

    it('should not pass roles guard', () => {
        @Roles(RoleType.ADMIN)
        class Controller {}

        const ctx = createMockedExecutionContext(Controller, RoleType.USER);

        const canActivate = rolesGuard.canActivate(ctx as any);
        expect(canActivate).toBe(false);
    });

    it('should pass if no role required by handler', () => {
        class Controller {}

        const ctx = createMockedExecutionContext(Controller, RoleType.USER);

        const canActivate = rolesGuard.canActivate(ctx as any);
        expect(canActivate).toBe(true);
    });
});
