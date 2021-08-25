'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {AbstractDto} from '../../../common/dto/AbstractDto';
import {BoardEntity} from '../board.entity';

export class BoardDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    createdUserId: string;

    @ApiPropertyOptional()
    data: string;

    @ApiPropertyOptional()
    categoryId: string;

    @ApiPropertyOptional()
    imageId: string;

    @ApiPropertyOptional()
    createdAt: Date;

    constructor(board: BoardEntity) {
        super(board);
        this.name = board.name;
        this.orgId = board.orgId;
        this.createdUserId = board.createdUserId;
        this.data = board.data;
        this.categoryId = board.categoryId;
        this.imageId = board.imageId;
        this.createdAt = board.createdAt;
    }
}
