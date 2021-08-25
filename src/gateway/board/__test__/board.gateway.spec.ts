/* eslint-disable @typescript-eslint/unbound-method */

import { Test } from '@nestjs/testing';

import { BoardEventEnum } from '../../../common/constants/board-event';
import { mockUserService } from '../../../modules/__test__/base.service.specs';
import { UserService } from '../../../modules/user/user.service';
import { mockConfigService } from '../../../shared/__test__/base.service.specs';
import { ConfigService } from '../../../shared/services/config.service';
import { BoardGateway } from '../board.gateway';
import { BoardEventDto } from '../dto/board-event.dto';

const createMockSocket = () => {
    const mockSocket = {
        join: jest.fn(),
        leave: jest.fn(),
        emit: jest.fn(),
        to: jest.fn(() => ({ emit: jest.fn() })),
        broadcast: {
            to: jest.fn(() => ({ emit: jest.fn() })),
        },
    };

    return mockSocket as any;
};

describe('BoardGateway', () => {
    let boardGateway: BoardGateway;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                { provide: ConfigService, useFactory: mockConfigService },
                { provide: UserService, useFactory: mockUserService },
                BoardGateway,
            ],
        }).compile();

        boardGateway = module.get(BoardGateway);
        boardGateway.server = createMockSocket();
    });

    it('should broadcast event on creating board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Hello World',
        };

        const mockSocket = createMockSocket();
        boardGateway.create(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.CREATE, data.data);
    });

    it('should join user to room and broadcast event to others', () => {
        const boardId = '10';

        const mockSocket = createMockSocket();
        boardGateway.joinBoard(mockSocket, boardId);

        expect(mockSocket.join).toBeCalledWith(boardId);
        const { emit } = mockSocket;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.JOIN_BOARD, boardId);
    });

    it('should leave user from room and broadcast event to others', () => {
        const boardId = '10';

        const mockSocket = createMockSocket();
        boardGateway.leaveBoard(mockSocket, boardId);

        expect(mockSocket.leave).toBeCalledWith(boardId);
        const { emit } = mockSocket;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.LEAVE_BOARD, boardId);
    });

    it('should broadcast event on updating board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Update payload',
        };

        const mockSocket = createMockSocket();
        boardGateway.update(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.UPDATE, data.data);
    });

    it('should broadcast event on moving board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Move payload',
        };

        const mockSocket = createMockSocket();
        boardGateway.move(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.MOVE, data.data);
    });

    it('should broadcast event on deleting board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Delete payload',
        };

        const mockSocket = createMockSocket();
        boardGateway.delete(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.DELETE, data.data);
    });

    it('should broadcast event on unlocking board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Unlock payload',
        };

        const mockSocket = createMockSocket();
        boardGateway.unlock(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.UNLOCK, data.data);
    });

    it('should broadcast event on locking board', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Locking payload',
        };

        const mockSocket = createMockSocket();
        boardGateway.lock(mockSocket, data);

        expect(mockSocket.broadcast.to).toBeCalledWith('10');
        const { emit } = mockSocket.broadcast.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.LOCK, data.data);
    });

    it('should do nothing on connection', () => {
        expect(boardGateway.handleConnection()).toBeUndefined();
    });

    it('should do nothing on disconnection', () => {
        expect(boardGateway.handleDisconnect()).toBeUndefined();
    });

    it('should broadcast via server instance in absence of client socket', () => {
        const data: BoardEventDto = {
            boardId: '10',
            data: 'Hello from the other side',
        };

        boardGateway.boardcastToBoardId(null, BoardEventEnum.LOCK, data);

        const { server } = boardGateway as any;
        expect(server.to).toBeCalledWith(data.boardId);
        const { emit } = server.to.mock.results[0].value;
        expect(emit).toBeCalledTimes(1);
        expect(emit).toBeCalledWith(BoardEventEnum.LOCK, data.data);
    });
});
