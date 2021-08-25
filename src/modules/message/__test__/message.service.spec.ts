import { Test } from '@nestjs/testing';

import {
    mockBoardUserOrgRepository,
    mockMessageRepository,
} from '../../__test__/base.repository.spec';
import { mockBoardGateway } from '../../../gateway/__test__/base.specs';
import { BoardGateway } from '../../../gateway/board/board.gateway';
import { BoardUserOrgRepository } from '../../board-user-org/board-user-org.repository';
import { UserEntity } from '../../user/user.entity';
import { MessageDto } from '../dto/MessageDto';
import { MessageEntity } from '../message.entity';
import { MessageRepository } from '../message.repository';
import { MessageService } from '../message.service';
import Mocked = jest.Mocked;
import { BoardMessageEventEnum } from '../../../common/constants/board-event';
import { pick } from 'lodash';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/unbound-method */

const messages: MessageEntity[] = Array(50)
    .fill({})
    .map((_, idx) => ({
        id: idx.toString(),
        boardId: 'boardId',
        message: `Message #${idx}`,
        dtoClass: MessageDto,
        createdAt: new Date(),
        updatedAt: new Date(Date.now() + 1000),
        sender: ({
            id: 'senderId',
            toDto() {
                return {
                    id: this.id,
                };
            },
        } as unknown) as UserEntity,
        toDto() {
            return new MessageDto(this);
        },
    }));

const messageDtos: MessageDto[] = messages.map((message) => message.toDto());

describe('MessageService', () => {
    let messageService: MessageService;
    let messageRepository: Mocked<MessageRepository>;
    let boardUserOrgRepository: Mocked<BoardUserOrgRepository>;
    let boardGateway: Mocked<BoardGateway>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: MessageRepository,
                    useFactory: mockMessageRepository,
                },
                {
                    provide: BoardUserOrgRepository,
                    useFactory: mockBoardUserOrgRepository,
                },
                { provide: BoardGateway, useFactory: mockBoardGateway },
                MessageService,
            ],
        }).compile();

        messageService = module.get(MessageService);
        messageRepository = module.get(MessageRepository);
        boardUserOrgRepository = module.get(BoardUserOrgRepository);
        boardGateway = module.get(BoardGateway);
    });

    describe('find', () => {
        beforeEach(() => {
            messageRepository.createQueryBuilder.mockReturnValue({
                _limit: 0,
                _offset: 0,
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                offset: jest.fn(function (offset: number) {
                    this._offset = offset;
                    return this;
                }),
                limit: jest.fn(function (limit: number) {
                    this._limit = limit;
                    return this;
                }),
                getMany: jest.fn(function () {
                    return messages.slice(
                        this._offset,
                        this._offset + this._limit,
                    );
                }),
            } as any);
        });

        it('should return paginated message DTOs', async () => {
            await expect(
                messageService.find('boardId', { limit: 5, offset: 5 }),
            ).resolves.toEqual(messageDtos.slice(5, 10));
        });

        it('should return message DTOs paginated with default values', async () => {
            await expect(
                messageService.find('boardId', {} as any),
            ).resolves.toEqual(messageDtos.slice(0, 10));
        });
    });

    describe('getCount', () => {
        it('should return correct count', async () => {
            messageRepository.createQueryBuilder.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                getCount: jest.fn().mockResolvedValue(10),
            } as any);

            await expect(messageService.getCount('boardId')).resolves.toBe(10);
        });
    });

    describe('create', () => {
        it('should create new message and broadcast event to boardGateway', async () => {
            messageRepository.save.mockResolvedValue(messages[0]);

            await expect(
                messageService.create(messages[0].sender, {
                    boardId: messages[0].boardId,
                    message: messages[0].message,
                }),
            ).resolves.toEqual(messageDtos[0]);

            expect(messageRepository.save).toBeCalledWith(
                pick(messages[0], 'boardId', 'dtoClass', 'message', 'sender'),
            );
            expect(boardGateway.boardcastToBoardId).toBeCalledWith(
                null,
                BoardMessageEventEnum.CREATE_MESSAGE,
                {
                    boardId: messages[0].boardId,
                    data: messageDtos[0],
                },
            );
        });
    });

    describe('update', () => {
        it('should update message', async () => {
            const newMessage = 'Message number zero';
            messageRepository.findOne.mockResolvedValue({
                ...messages[0],
            } as any);
            messageRepository.save.mockImplementation(
                (e) => Promise.resolve(e) as any,
            );

            await expect(
                messageService.update(messages[0].sender, 'id', {
                    message: newMessage,
                    boardId: messages[0].boardId,
                } as any),
            ).resolves.toEqual({
                ...messageDtos[0],
                message: newMessage,
            });

            expect(messageRepository.save).toBeCalledWith({
                ...messages[0],
                message: newMessage,
            });
            expect(boardGateway.boardcastToBoardId).toBeCalledWith(
                null,
                BoardMessageEventEnum.UPDATE_MESSAGE,
                {
                    boardId: messages[0].boardId,
                    data: {
                        ...messageDtos[0],
                        message: newMessage,
                    },
                },
            );
        });

        it('should not update message if message not given', async () => {
            messageRepository.findOne.mockResolvedValue({
                ...messages[0],
            } as any);
            messageRepository.save.mockImplementation(
                (e) => Promise.resolve(e) as any,
            );

            await expect(
                messageService.update(messages[0].sender, 'id', {
                    boardId: messages[0].boardId,
                } as any),
            ).resolves.toEqual({
                ...messageDtos[0],
            });

            expect(messageRepository.save).toBeCalledWith({
                ...messages[0],
            });
        });

        it("should throw not found exception when message doesn'nt exist", async () => {
            const newMessage = 'Message number zero';
            messageRepository.findOne.mockResolvedValue(null);

            await expect(
                messageService.update(messages[0].sender, 'id', {
                    message: newMessage,
                    boardId: messages[0].boardId,
                } as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw unauthorized exception if another person is updating it', async () => {
            const newMessage = 'Message number zero';
            messageRepository.findOne.mockResolvedValue(messages[0]);

            await expect(
                messageService.update(
                    ({ id: 'anotherId' } as unknown) as UserEntity,
                    'id',
                    {
                        message: newMessage,
                        boardId: messages[0].boardId,
                    } as any,
                ),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('delete', () => {
        it('should update message', async () => {
            const msgId = 'msgId';
            messageRepository.findOne.mockResolvedValue(messages[0]);

            await expect(
                messageService.delete(msgId, messages[0].sender),
            ).resolves.toBeUndefined();

            expect(messageRepository.delete).toBeCalledWith(msgId);
            expect(boardGateway.boardcastToBoardId).toBeCalledWith(
                null,
                BoardMessageEventEnum.DELETE_MESSAGE,
                {
                    boardId: messages[0].boardId,
                    data: messages[0],
                },
            );
        });

        it("should throw not found exception when message doesn'nt exist", async () => {
            messageRepository.findOne.mockResolvedValue(null);

            await expect(
                messageService.delete('msgId', messages[0].sender),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw unauthorized exception if another person is updating it', async () => {
            messageRepository.findOne.mockResolvedValue(messages[0]);

            await expect(
                messageService.delete('msgId', ({
                    id: 'anotherId',
                } as unknown) as UserEntity),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('checkPermission', () => {
        it("should throw not found exception if message doesn'nt exist", async () => {
            boardUserOrgRepository.find.mockResolvedValue(null);

            await expect(
                messageService.checkPermission('userId', 'boardId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should do nothing if message exist', async () => {
            boardUserOrgRepository.find.mockResolvedValue([
                { id: 'msgId' },
            ] as any);

            await expect(
                messageService.checkPermission('userId', 'boardId'),
            ).resolves.toBeUndefined();
        });
    });
});
