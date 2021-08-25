import { Test } from '@nestjs/testing';
import { QueryFailedFilter } from '../query-failed.filter';
import { mocked } from 'ts-jest/utils';
import { STATUS_CODES } from 'http';

describe('QueryFailedFilter', () => {
    let queryFailedFilter: QueryFailedFilter;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [QueryFailedFilter],
        }).compile();

        queryFailedFilter = module.get(QueryFailedFilter);
    });

    it('should respond with CONFLICT error when query constraint failed', () => {
        const exception = {
            constraint: 'UQ_97672ac88f789774dd47f7c8be3',
        };

        const response = {
            status: jest.fn(() => ({
                json: jest.fn(),
            })),
        };

        const mockArgumentHost = mocked({
            switchToHttp: jest.fn(() => ({
                getResponse: jest.fn(() => response),
            })),
        });

        queryFailedFilter.catch(exception, mockArgumentHost as any);

        const status = response.status;
        const json = status.mock.results[0].value.json;

        expect(status).toBeCalledWith(409);
        expect(json).toBeCalledWith({
            statusCode: 409,
            message: 'error.unique.email',
            error: STATUS_CODES[409],
        });
    });

    it('should respond with 500 when unspecified query constraint failed', () => {
        const exception = {
            constraint: 'UX',
        };

        const response = {
            status: jest.fn(() => ({
                json: jest.fn(),
            })),
        };

        const mockArgumentHost = mocked({
            switchToHttp: jest.fn(() => ({
                getResponse: jest.fn(() => response),
            })),
        });

        queryFailedFilter.catch(exception, mockArgumentHost as any);

        const status = response.status;
        const json = status.mock.results[0].value.json;

        expect(status).toBeCalledWith(500);
        expect(json).toBeCalledWith({
            statusCode: 500,
            error: 'Internal Server Error',
            message: undefined,
        });
    });
});
