import { Test } from '@nestjs/testing';
import * as AWS from 'aws-sdk';

import { mockGeneratorService } from '../../__test__/base.service.specs';
import { AwsS3Service } from '../aws-s3.service';
import { ConfigService } from '../config.service';
import { GeneratorService } from '../generator.service';

describe('AwsS3Service', () => {
    // spy on AWS S3 constructor and return desired mocks
    const putObject = jest.fn().mockReturnValue({ promise: jest.fn() });
    jest.spyOn(AWS, 'S3').mockImplementation(() => ({ putObject } as any));

    describe('without accessKey', () => {
        let awsS3Service: AwsS3Service;
        let configService: ConfigService;
        let generatorService;

        beforeEach(async () => {
            const module = await Test.createTestingModule({
                providers: [
                    AwsS3Service,
                    {
                        provide: ConfigService,
                        useValue: {
                            baseLink: 'https://base.com/',
                            awsS3Config: {},
                        },
                    },
                    {
                        provide: GeneratorService,
                        useFactory: mockGeneratorService,
                    },
                ],
            }).compile();

            configService = module.get<ConfigService>(ConfigService);
            generatorService = module.get<GeneratorService>(GeneratorService);
            awsS3Service = module.get<AwsS3Service>(AwsS3Service);
        });

        describe('uploadImage', () => {
            it('should put object on aws', async () => {
                const file = {
                    mimetype: 'image/png',
                    buffer: 'fakeBuffer',
                };
                generatorService.fileName.mockReturnValue('test');

                await expect(
                    awsS3Service.uploadImage(file as any),
                ).resolves.toEqual(`${configService.baseLink}images/test`);

                expect(putObject).toBeCalledWith({
                    Bucket: configService.awsS3Config.bucketName,
                    Body: file.buffer,
                    ACL: 'public-read',
                    Key: 'images/test',
                    ContentType: 'image/jpeg',
                });
            });
        });
    });

    describe('with access key', () => {
        it('should create instance with accessKey config', async () => {
            const configService = {
                awsS3Config: {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccessKey',
                },
            };

            await Test.createTestingModule({
                providers: [
                    AwsS3Service,
                    { provide: ConfigService, useValue: configService },
                    {
                        provide: GeneratorService,
                        useFactory: mockGeneratorService,
                    },
                ],
            }).compile();

            expect(AWS.S3).toBeCalledWith({
                apiVersion: '2010-12-01',
                region: 'eu-central-1',
                credentials: configService.awsS3Config,
            });
        });
    });
});
