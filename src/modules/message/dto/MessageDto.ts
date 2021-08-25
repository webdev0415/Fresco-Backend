'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { UserDto } from '../../user/dto/UserDto';
import { MessageEntity } from '../message.entity';

export class MessageDto extends AbstractDto {
    @ApiProperty()
    boardId: string;

    @ApiProperty()
    sender: UserDto;

    @ApiPropertyOptional()
    message: string;

    @ApiPropertyOptional()
    createdAt: Date;

    constructor(messageEntity: MessageEntity) {
        super(messageEntity);
        this.sender = messageEntity.sender.toDto();
        this.boardId = messageEntity.boardId;
        this.message = messageEntity.message;
        this.createdAt = messageEntity.createdAt;
    }
}
