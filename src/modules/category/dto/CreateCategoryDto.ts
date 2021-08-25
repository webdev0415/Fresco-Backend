'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';

export class CreateCategoryDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    imageId: string;

    path: string;
}
