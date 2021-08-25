/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { applicationInstance } from '../main';
import { OrganizationService } from '../modules/organization/organization.service';

@ValidatorConstraint({ async: true })
export class IsOrganizationNameUniqueConstraint
    implements ValidatorConstraintInterface {
    async validate(title: string, args: ValidationArguments): Promise<boolean> {
        const value: string = args.object[args.property];

        const didExist = await (
            await applicationInstance.resolve(OrganizationService)
        ).isOrganizationNameExist(value);

        return !didExist;
    }
    defaultMessage(args: ValidationArguments): string {
        // here you can provide default error message if validation failed
        return 'Organization name should be unique';
    }
}

export function isOrganizationNameUnique(
    validationOptions?: ValidationOptions,
) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            propertyName,
            target: object.constructor,
            options: validationOptions,
            constraints: [],
            validator: IsOrganizationNameUniqueConstraint,
        });
    };
}
