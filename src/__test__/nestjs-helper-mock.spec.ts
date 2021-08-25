import {
    ArgumentsHost,
    HttpArgumentsHost,
    WsArgumentsHost,
} from '@nestjs/common/interfaces/features/arguments-host.interface';
import { ExecutionContext } from '@nestjs/common';

export const mockHttpArgumentsHost: HttpArgumentsHost = {
    getRequest: jest.fn(),
    getResponse: jest.fn(),
    getNext: jest.fn(),
};

export const mockWsArgumentsHost: WsArgumentsHost = {
    getClient: jest.fn(),
    getData: jest.fn(),
};

export const mockArgumentsHost: ArgumentsHost = {
    switchToHttp: jest.fn(() => mockHttpArgumentsHost),
    switchToWs: jest.fn(() => mockWsArgumentsHost),
    switchToRpc: jest.fn(),
    getType: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
};

export const mockExecutionContext: ExecutionContext = {
    ...mockArgumentsHost,
    getClass: jest.fn(),
    getHandler: jest.fn(),
};

describe('nestjs helper mocks', () => {
    it('should not do anything', () => {
        expect(1).toEqual(1);
    });
});
