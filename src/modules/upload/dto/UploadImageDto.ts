'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {AbstractDto} from '../../../common/dto/AbstractDto';
import {UploadImageEntity} from '../upload-image.entity';

export class UploadImageDto extends AbstractDto {
    @ApiPropertyOptional()
    type: string;

    @ApiPropertyOptional()
    path: string;

    constructor(uploadImageEntity: UploadImageEntity) {
        super(uploadImageEntity);
        this.type = uploadImageEntity.type;
        this.path = uploadImageEntity.path;
    }
}
