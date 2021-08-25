import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { BoardMessageEventEnum } from '../../common/constants/board-event';
import { BoardGateway } from '../../gateway/board/board.gateway';
import { BoardUserOrgRepository } from '../board-user-org/board-user-org.repository';
import { UserEntity } from '../user/user.entity';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { MessageDto } from './dto/MessageDto';
import { MessageInfoDto } from './dto/MessageInfoDto';
import { UpdateMessageDto } from './dto/UpdateMessageDto';
import { MessageEntity } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
    constructor(
        public readonly messageRepository: MessageRepository,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
        public readonly boardGateway: BoardGateway,
    ) {}

    async find(
        boardId: string,
        query: { limit: number; offset: number },
    ): Promise<MessageInfoDto[]> {
        const offset = query.offset ? query.offset : 0;
        const limit = query.limit ? query.limit : 10;

        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .where('message.boardId = :boardId', { boardId })
            .offset(offset)
            .limit(limit)
            .orderBy('message.createdAt', 'DESC')
            .getMany();

        return messages.map((m) => m.toDto());
    }

    async getCount(boardId: string): Promise<number> {
        return this.messageRepository
            .createQueryBuilder()
            .where('boardId = :boardId', { boardId })
            .getCount();
    }

    async create(
        sender: UserEntity,
        createMessageDto: CreateMessageDto,
    ): Promise<MessageDto> {
        const messageModel = new MessageEntity();
        messageModel.boardId = createMessageDto.boardId;
        messageModel.sender = sender;
        messageModel.message = createMessageDto.message;

        const message = await this.messageRepository.save(messageModel);
        const messageDto = message.toDto();

        // Send socket event to all board members with newly created message as data
        this.boardGateway.boardcastToBoardId(
            null,
            BoardMessageEventEnum.CREATE_MESSAGE,
            {
                boardId: createMessageDto.boardId,
                data: messageDto,
            },
        );

        return messageDto;
    }

    async update(
        sender: UserEntity,
        id: string,
        updateMessageDto: UpdateMessageDto,
    ): Promise<UpdateMessageDto> {
        const message = await this.messageRepository.findOne(id, {
            relations: ['sender'],
        });

        if (!message) {
            throw new NotFoundException();
        }
        if (message.sender.id !== sender.id) {
            throw new UnauthorizedException();
        }

        message.message = updateMessageDto.message || message.message;
        const updatedMessage = await this.messageRepository.save(message);
        const updatedMessageDto = updatedMessage.toDto();

        // Send socket event to all board members with updated message as data
        this.boardGateway.boardcastToBoardId(
            null,
            BoardMessageEventEnum.UPDATE_MESSAGE,
            {
                boardId: updateMessageDto.boardId,
                data: updatedMessageDto,
            },
        );

        return updatedMessageDto;
    }

    async delete(id: string, sender: UserEntity): Promise<void> {
        const message = await this.messageRepository.findOne(id, {
            relations: ['sender'],
        });

        if (!message) {
            throw new NotFoundException();
        }

        if (message.sender.id !== sender.id) {
            throw new UnauthorizedException();
        }

        await this.messageRepository.delete(id);

        // Send socket event to all board members with deleted message as data
        this.boardGateway.boardcastToBoardId(
            null,
            BoardMessageEventEnum.DELETE_MESSAGE,
            {
                boardId: message.boardId,
                data: message,
            },
        );
    }

    async checkPermission(userId, boardId) {
        const message = await this.boardUserOrgRepository.find({
            where: {
                boardId,
                userId,
            },
        });
        if (!message || !message.length) {
            throw new NotFoundException();
        }
    }
}
