import { RoleType } from '../../common/constants/role-type';

describe('Roles', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Roles snapshot ', async () => {
        const { Roles } = await import('../roles.decorator');
        expect(Roles).toMatchSnapshot();
    });

    it('should call SetMetadata with roles', async () => {
        const roles = [RoleType.ADMIN];

        const mockSetMetadata = jest.fn((key, value) => {
            expect(key).toBe('roles');
            expect(value).toEqual(roles);
        });

        jest.mock('@nestjs/common', () => ({
            ...jest.requireActual('@nestjs/common'),
            SetMetadata: mockSetMetadata,
        }));

        const { Roles } = await import('../roles.decorator');
        Roles(...roles);

        expect(mockSetMetadata.mock.calls.length).toBe(1);
    });
});
