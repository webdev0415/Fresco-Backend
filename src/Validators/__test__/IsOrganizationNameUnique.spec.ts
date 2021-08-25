/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/tslint/config */

import { applicationInstance } from '../../main';
import { registerDecorator } from 'class-validator';

jest.mock('../../main', () => ({
    applicationInstance: {
        resolve: jest.fn(),
    },
}));

jest.mock('class-validator', () => ({
    ...jest.requireActual('class-validator'),
    registerDecorator: jest.fn(),
}));

describe('IsOrganizationNameUnique', () => {
    it('should pass validation if organization name does not exist', async () => {
        const mockOrganizationService = {
            isOrganizationNameExist: jest.fn(() => false),
        };

        (applicationInstance.resolve as any).mockImplementation(
            () => mockOrganizationService,
        );

        const { IsOrganizationNameUniqueConstraint } = await import(
            '../IsOrganizationNameUnique'
        );

        const constraint = new IsOrganizationNameUniqueConstraint();

        const args = {
            object: {
                name: 'Hello',
            },
            property: 'name',
        };

        await expect(constraint.validate('Hello', args as any)).resolves.toBe(
            true,
        );
    });

    it('should return the right validation message', async () => {
        const { IsOrganizationNameUniqueConstraint } = await import(
            '../IsOrganizationNameUnique'
        );

        const constraint = new IsOrganizationNameUniqueConstraint();

        expect(constraint.defaultMessage({} as any)).toBe(
            'Organization name should be unique',
        );
    });

    it('should store right decorators for validation constraint', async () => {
        jest.mock('class-validator', () => ({
            registerDecorator: jest.fn(),
        }));

        const {
            IsOrganizationNameUniqueConstraint,
            isOrganizationNameUnique,
        } = await import('../IsOrganizationNameUnique');

        class Sample {
            @isOrganizationNameUnique({ each: true })
            prop: string;
        }

        const arg = (registerDecorator as jest.Mock).mock.calls[0][0];
        expect(arg).toEqual({
            propertyName: 'prop',
            target: Sample,
            options: { each: true },
            constraints: [],
            validator: IsOrganizationNameUniqueConstraint,
        });
    });
});
