'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CategoryEntity } from '../../../modules/category/category.entity';

export class DefaultTemplateInfoDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    data: string;

    @ApiPropertyOptional()
    category: CategoryEntity;

    path: string;
}
