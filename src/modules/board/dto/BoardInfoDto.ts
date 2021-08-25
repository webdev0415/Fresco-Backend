'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CategoryEntity } from '../../../modules/category/category.entity';
import {CanvasUserOrgEntity} from "../../canvas-user-org/canvas-user-org.entity";
import {BoardUserOrgEntity} from "../../board-user-org/board-user-org.entity";
import { UserDto } from '../../../modules/user/dto/UserDto';

export class BoardInfoDto {
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
    @IsOptional()
    categoryId: string;

    @ApiPropertyOptional()
    @IsOptional()
    imageId: string;

    @ApiPropertyOptional()
    @IsOptional()
    createdAt: Date;

    path: string;
    category: CategoryEntity;


    @ApiPropertyOptional({type:BoardUserOrgEntity,isArray:true})

    boards: BoardUserOrgEntity[];


    @ApiPropertyOptional({type:UserDto,isArray:true})
    users: UserDto[];
}
