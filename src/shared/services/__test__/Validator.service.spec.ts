import {ConfigService} from '../config.service';
import {AwsS3Service} from "../aws-s3.service";
import {GeneratorService} from "../generator.service";
import {Test} from "@nestjs/testing";
import {mockConfigService, mockGeneratorService} from "../../__test__/base.service.specs";
import mock = jest.mock;
import {ValidatorService} from "../validator.service";

describe('ValidatorService', () => {


    describe('Should return ', () => {

        it('get', async () => {
let service=new ValidatorService()

       expect(service.isImage("image/jpeg")).toBeTruthy()
        });
    });



});
