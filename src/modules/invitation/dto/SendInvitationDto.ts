'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';

import {PermissionEnum} from '../../../common/constants/permission';

export class SendInvitationDto {
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    orgId: string;


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    boardId: string;


    // @IsString()
    // @ApiProperty()
    // toUserId: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    toEmail: string;
    //
    // @IsString()
    // @ApiPropertyOptional()
    // token: string;

    @IsEnum(PermissionEnum)
    @ApiPropertyOptional()
    permission: PermissionEnum;
    //
    // name?: string;
    //
    // organizationName?: string;
}
