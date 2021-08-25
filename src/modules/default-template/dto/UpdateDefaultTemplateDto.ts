'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDefaultTemplateDto {
    id: string;

    @ApiPropertyOptional()
    @IsOptional()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    data: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageId: string;

    path: string;
}
