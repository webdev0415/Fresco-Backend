'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UpdateCanvasDto {
    id: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    data: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    imageId: string;

    path: string;
}
