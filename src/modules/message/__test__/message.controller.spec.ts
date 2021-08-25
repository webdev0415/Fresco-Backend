import { Test } from '@nestjs/testing';

import { mockMessageService } from '../../__test__/base.service.specs';
import { userEntity } from '../../auth/__test__/auth.controller.spec';
import { UserEntity } from '../../user/user.entity';
import { CreateMessageDto } from '../dto/CreateMessageDto';
import { UpdateMessageDto } from '../dto/UpdateMessageDto';
import { MessageController } from '../message.controller';
import { MessageService } from '../message.service';

describe('MessageController', () => {
    const dateValue = new Date();

    const mockMessageEntity: {
        createdAt: Date;
        sender: UserEntity;
        boardId: string;
        id: string;
        message: string;
        updatedAt: Date;
    } = {
        id: 'id',
        boardId: 'boardId',
        sender: userEntity.toDto(),
        message: 'message',
        createdAt: dateValue,
        updatedAt: dateValue,
    };

    const mockMessageData = {
        count: 1,
        messages: mockMessageEntity,
    };

    let messageController: MessageController;
    let messageService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MessageController,
                { provide: MessageService, useFactory: mockMessageService },
            ],
        }).compile();

        messageController = module.get<MessageController>(MessageController);
        messageService = module.get<MessageService>(MessageService);
    });

    describe('get messages by board id', () => {
        it('should return board messages', async () => {
            messageService.find.mockResolvedValue(mockMessageEntity);
            messageService.getCount.mockResolvedValue(mockMessageData.count);

            const result = await messageController.find(userEntity, 'boardId', {
                limit: 5,
                offset: 0,
            });

            expect(result).toEqual(mockMessageData);
        });
    });

    describe('create message', () => {
        it('should return new messages', async () => {
            const createMessageDto = new CreateMessageDto();

            messageService.create.mockResolvedValue(createMessageDto);
            const result = await messageController.create(
                userEntity,
                createMessageDto,
            );
            expect(result).toEqual(createMessageDto);
        });
    });

    describe('update message', () => {
        it('should return updated message', async () => {
            const updateMessageDto = new UpdateMessageDto();
            messageService.update.mockResolvedValue(mockMessageEntity);
            const result = await messageController.update(
                userEntity,
                'id',
                updateMessageDto,
            );
            expect(result).toEqual(mockMessageEntity);
        });
    });

    describe('delete message', () => {
        it('should return void', async () => {
            messageService.delete.mockResolvedValue(mockMessageEntity);
            const result = await messageController.delete(userEntity, 'id');
            expect(result).toBeFalsy();
        });
    });
});
