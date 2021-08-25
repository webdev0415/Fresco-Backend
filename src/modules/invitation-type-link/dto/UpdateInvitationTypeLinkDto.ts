'use strict';

import {ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsEnum, IsNotEmpty} from "class-validator";
import {InvitationType} from "../../../common/constants/invitation-type";
import {PermissionEnum} from "../../../common/constants/permission";

export class UpdateInvitationTypeLinkDto {
    id: string;

    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    createdUserId: string;

    @ApiPropertyOptional()
    @IsEnum(PermissionEnum, { message: 'permission is not valid' })
    permission: PermissionEnum;

    @ApiPropertyOptional()
    numberOfUsers: number;

    @ApiPropertyOptional()
    @IsEnum(InvitationType, { message: 'type is not valid' })
    type: InvitationType;

    @ApiPropertyOptional()
    typeId: string;

    isDeleted: boolean;

}