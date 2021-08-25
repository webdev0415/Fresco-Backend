'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';

export class CreateInvitationTypeLinkDto {
    createdUserId: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'orgId is required' })
    orgId: string;

    numberOfUser: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'token is required' })
    token: string;

    @IsEnum(PermissionEnum, { message: 'permission is not valid' })
    @ApiProperty()
    @IsNotEmpty({ message: 'permission is required' })
    permission: PermissionEnum;

    @IsEnum(InvitationType, { message: 'type is not valid' })
    @ApiProperty()
    @IsNotEmpty({ message: 'type is required' })
    type: InvitationType;

    @ApiProperty()
    @IsNotEmpty({ message: 'typeId is required' })
    typeId: string;
}
