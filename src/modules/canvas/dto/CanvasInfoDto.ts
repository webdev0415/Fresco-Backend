'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../../modules/user/dto/UserDto';

import { CategoryEntity } from '../../../modules/category/category.entity';
import {CanvasUserOrgEntity} from "../../canvas-user-org/canvas-user-org.entity";
// import { UploadImageEntity } from '../../../modules/upload/upload-image.entity';

export class CanvasInfoDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;

    @ApiPropertyOptional()
    @IsString()
    data: string;

    @ApiPropertyOptional()
    @IsString()
    imageId: string;

    @ApiPropertyOptional()
    category: CategoryEntity;

    @ApiPropertyOptional()    
    createdAt: Date;

    // @ApiPropertyOptional()
    // image: UploadImageEntity;

    canvases: CanvasUserOrgEntity[];

    users: UserDto[];

    path: string;
}
