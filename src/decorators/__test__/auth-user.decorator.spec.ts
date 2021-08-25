import { mockExecutionContext } from '../../__test__/nestjs-helper-mock.spec';

describe('AuthUser', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.resetModuleRegistry();
    });

    it('AuthUser snapshot ', async () => {
        const { AuthUser } = await import('../auth-user.decorator');
        expect(AuthUser).toMatchSnapshot();
    });

    it('AuthUser to be called ', async () => {
        const { AuthUser } = await import('../auth-user.decorator');
        expect(AuthUser({})).toBeTruthy();
    });

    it('should pass user as argument', async () => {
        const user = {
            id: 1,
            name: 'john',
        };

        // Mock request
        const executionContext = mockExecutionContext;
        const getRequest = executionContext.switchToHttp()
            .getRequest as jest.Mock;
        getRequest.mockImplementation(() => ({
            user,
        }));

        const mockCreateParamDecorator = (factory) => {
            return () => {
                const result = factory(null, executionContext);
                expect(result).toBe(user);
            };
        };

        jest.mock('@nestjs/common', () => ({
            ...jest.requireActual('@nestjs/common'),
            createParamDecorator: mockCreateParamDecorator,
        }));

        // Test
        const { AuthUser } = await import('../auth-user.decorator');
        AuthUser();

        // Assert
        expect(getRequest.mock.calls.length).toBe(1);
    });
});
