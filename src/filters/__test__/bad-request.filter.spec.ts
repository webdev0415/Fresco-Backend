import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { STATUS_CODES } from 'http';
import { mocked } from 'ts-jest/utils';

import { HttpExceptionFilter } from '../bad-request.filter';
import { ValidationError } from 'class-validator';

describe('BadRequestFilter', () => {
    let httpExceptionFilter: HttpExceptionFilter;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [HttpExceptionFilter],
        }).compile();

        httpExceptionFilter = module.get(HttpExceptionFilter);
    });

    it('should respond with 400 error when BadRequest exception occurs', () => {
        const exceptionResponse = {} as any;
        const exception = new BadRequestException({
            response: exceptionResponse,
            message: 'Bad Request',
        });

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

        httpExceptionFilter.catch(exception, mockArgumentHost as any);

        const status = response.status;
        const json = status.mock.results[0].value.json;

        expect(status).toBeCalledWith(400);
        expect(json).toBeCalledWith({
            statusCode: 400,
            message: STATUS_CODES[400],
            error: STATUS_CODES[400],
            response: exceptionResponse,
        });
    });

    it('should respond with 422 status when validation error occurs', () => {
        const exceptionResponse = {} as any;
        const error = new ValidationError();
        error.property = 'prop1';
        error.constraints = {
            aValidationError: null,
        };

        const childError = new ValidationError();
        childError.property = 'prop2';
        childError.constraints = {
            bValidationError: null,
        };
        error.children = [childError];

        const exception = new BadRequestException({
            response: exceptionResponse,
            message: [error],
        });

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

        httpExceptionFilter.catch(exception, mockArgumentHost as any);

        const status = response.status;
        const json = status.mock.results[0].value.json;

        expect(status).toBeCalledWith(422);
        expect(json).toBeCalledWith({
            statusCode: 422,
            message: [
                {
                    constraints: {
                        aValidationError: 'error.fields.a_validation_error',
                    },
                    property: 'prop1',
                    children: [
                        {
                            constraints: {
                                bValidationError:
                                    'error.fields.b_validation_error',
                            },
                            property: 'prop2',
                        },
                    ],
                },
            ],
            error: STATUS_CODES[422],
            response: exceptionResponse,
        });
    });

    it('should respond constraint message when it exists', () => {
        const exceptionResponse = {} as any;
        const error = new ValidationError();
        error.property = 'prop1';
        error.constraints = {
            aValidationError: 'A validation failed',
        };

        const exception = new BadRequestException({
            response: exceptionResponse,
            message: [error],
        });

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

        httpExceptionFilter.catch(exception, mockArgumentHost as any);

        const status = response.status;
        const json = status.mock.results[0].value.json;

        expect(status).toBeCalledWith(422);
        expect(json).toBeCalledWith({
            statusCode: 422,
            message: [
                {
                    constraints: {
                        aValidationError: 'A validation failed',
                    },
                    property: 'prop1',
                },
            ],
            error: STATUS_CODES[422],
            response: exceptionResponse,
        });
    });
});
