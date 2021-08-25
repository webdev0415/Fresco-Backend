'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PermissionEnum } from '../../../common/constants/permission';

export class VerifyTokenDto {
    id: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    orgId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsEnum(PermissionEnum)
    @IsNotEmpty()
    @ApiPropertyOptional()
    permission: PermissionEnum;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    token: string;
}
