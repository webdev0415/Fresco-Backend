import { mocked } from 'ts-jest/utils';

import { BoardGateway } from '../board/board.gateway';

export const mockBoardGateway = () =>
    mocked<BoardGateway>(({
        boardcastToBoardId: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        move: jest.fn(),
        joinBoard: jest.fn(),
        leaveBoard: jest.fn(),
        lock: jest.fn(),
        unlock: jest.fn(),
        handleConnection: jest.fn(),
        handleDisconnect: jest.fn(),
    } as unknown) as BoardGateway);
