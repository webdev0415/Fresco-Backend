import { WsExceptionFilter } from '../ws-exception.filter';
import { mockArgumentsHost } from '../../../__test__/nestjs-helper-mock.spec';

describe('WsExceptionFilter', () => {
    let wsExceptionFilter;

    beforeEach(() => {
        wsExceptionFilter = new WsExceptionFilter('throw');
    });

    it('should emit exception to client and disconnect it', () => {
        const mockSocket = { emit: jest.fn(), disconnect: jest.fn() };
        const argumentsHost = mockArgumentsHost;
        const getClient = mockArgumentsHost.switchToWs().getClient as jest.Mock;
        getClient.mockImplementation(() => mockSocket);

        const exception = new Error('This is a critical error');

        wsExceptionFilter.catch(exception, argumentsHost);

        // Check calls to socket methods
        expect(mockSocket.emit.mock.calls.length).toBe(1);
        expect(mockSocket.disconnect.mock.calls.length).toBe(1);

        expect(mockSocket.emit.mock.calls[0][0]).toBe('throw');
        expect(mockSocket.emit.mock.calls[0][1]).toBe(exception);
    });
});
