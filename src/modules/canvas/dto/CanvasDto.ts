

'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {AbstractDto} from '../../../common/dto/AbstractDto';
import {CanvasEntity} from '../canvas.entity';

export class CanvasDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    createdUserId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    data: string;

    @ApiPropertyOptional()
    imageId: string;

    @ApiPropertyOptional()
    categoryId: string;

    @ApiPropertyOptional()
    createdAt?: Date;

    constructor(canvasEntity: CanvasEntity) {
        super(canvasEntity);
        this.name = canvasEntity.name;
        this.createdUserId = canvasEntity.createdUserId;
        this.orgId = canvasEntity.orgId;
        this.data = canvasEntity.data;
        this.categoryId = canvasEntity.categoryId;
        this.imageId = canvasEntity.imageId;
        this.createdAt = canvasEntity.createdAt;
    }
}
