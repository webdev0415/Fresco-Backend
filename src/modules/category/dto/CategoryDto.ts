'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {AbstractDto} from '../../../common/dto/AbstractDto';
import {CategoryEntity} from '../category.entity';

export class CategoryDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    imageId: string;

    constructor(categoryEntity: CategoryEntity) {
        super(categoryEntity);
        this.name = categoryEntity.name;
        this.imageId = categoryEntity.imageId;
    }
}
