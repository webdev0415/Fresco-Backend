import {ConfigService} from '../config.service';
import {AwsS3Service} from "../aws-s3.service";
import {GeneratorService} from "../generator.service";
import {Test} from "@nestjs/testing";
import {mockConfigService, mockGeneratorService} from "../../__test__/base.service.specs";
import mock = jest.mock;

describe('GeneratorService', () => {

    let generatorService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                GeneratorService
            ],
        }).compile();
        generatorService = module.get<GeneratorService>(GeneratorService);
    });

    describe('uuid', () => {

        it('get', async () => {

       expect(generatorService.uuid()).toBeTruthy()
        });
    });

    describe('filename', () => {

        it('get', async () => {

            expect(generatorService.fileName("")).toBeTruthy()
        });
    });

});
