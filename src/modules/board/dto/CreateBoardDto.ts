'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateBoardDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageId: string;
}
