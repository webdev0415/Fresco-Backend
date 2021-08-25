'use strict';

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

// import { UploadImageEntity } from '../../../modules/upload/upload-image.entity';

export class CreateCanvasDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    data: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    // image: UploadImageEntity;
    path: string;
}
