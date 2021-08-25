'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class DeleteBoardDto {
    @ApiPropertyOptional()
    boardId: string;

    @ApiPropertyOptional()
    @IsString()
    orgId: string;

    @ApiPropertyOptional()
    userId: string;
}
