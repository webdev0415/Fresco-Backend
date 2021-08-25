'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class CreateUploadImageDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    type: string;
}
