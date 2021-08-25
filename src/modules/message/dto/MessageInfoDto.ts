'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserDto } from '../../user/dto/UserDto';

export class MessageInfoDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    boardId: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    sender: UserDto;

    @ApiPropertyOptional()
    @IsNotEmpty()
    message: string;
}
