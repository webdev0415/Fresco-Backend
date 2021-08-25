'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    boardId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    message: string;
}
