'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class DeleteCanvasDto {
    canvasId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    orgId: string;
}
