import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserEntity } from '../user/user.entity';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { MessageDto } from './dto/MessageDto';
import { MessageInfoDto } from './dto/MessageInfoDto';
import { UpdateMessageDto } from './dto/UpdateMessageDto';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('message')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class MessageController {
    constructor(public readonly messageService: MessageService) {}

    @Get(':boardId')
    @ApiOkResponse({
        type: MessageInfoDto,
        description: 'get message',
    })
    async find(
        @AuthUser() user: UserEntity,
        @Param('boardId') boardId: string,
        @Query() query: { limit: number; offset: number },
    ): Promise<{ count: number; messages: MessageInfoDto[] }> {
        await this.messageService.checkPermission(user.id, boardId);
        const messages = await this.messageService.find(boardId, query);
        const count = await this.messageService.getCount(boardId);
        return { messages, count };
    }

    @Post('')
    @ApiOkResponse({
        type: CreateMessageDto,
        description: 'create message',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createMessageDto: CreateMessageDto,
    ): Promise<MessageDto> {
        return this.messageService.create(user, createMessageDto);
    }

    @Put(':id')
    @ApiOkResponse({
        type: UpdateMessageDto,
        description: 'update message',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDto,
    ): Promise<UpdateMessageDto> {
        return this.messageService.update(user, id, updateMessageDto);
    }

    @Delete(':id')
    @ApiNoContentResponse({
        type: MessageDto,
        description: 'delete message',
    })
    @HttpCode(204)
    async delete(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
    ): Promise<void> {
        await this.messageService.delete(id, user);
    }
}
