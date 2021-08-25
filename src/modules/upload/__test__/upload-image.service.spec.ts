import {Test} from '@nestjs/testing';
import {mockCanvasRepository, mockUploadImageRepository} from "../../__test__/base.repository.spec";
import {UploadImageService} from "../upload-image.service";
import {UploadImageRepository} from "../upload-image.repository";
import {CanvasRepository} from "../../canvas/canvas.repository";
import {ValidatorService} from "../../../shared/services/validator.service";
import {AwsS3Service} from "../../../shared/services/aws-s3.service";
import {CreateUploadImageDto} from "../dto/CreateUploadImageDto";
import {IFile} from "../../../interfaces/IFile";
import {FileNotImageException} from "../../../exceptions/file-not-image.exception";
import {UploadImageEntity} from "../upload-image.entity";
import {NotFoundException} from "@nestjs/common";
import {mockAwsS3Service, mockValidatorService} from "../../__test__/base.service.specs";


describe('Organization Service', () => {

    let uploadImageRepository;
    let canvasRepository;
    let validatorService;
    let awsS3Service;
    let uploadImageService: UploadImageService
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                {provide: UploadImageRepository, useFactory: mockUploadImageRepository},
                {provide: CanvasRepository, useFactory: mockCanvasRepository},
                {provide: ValidatorService, useFactory: mockValidatorService},
                {provide: AwsS3Service, useFactory: mockAwsS3Service},
                UploadImageService
            ],
        }).compile();

        uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        canvasRepository = module.get<CanvasRepository>(CanvasRepository);
        validatorService = module.get<ValidatorService>(ValidatorService);
        awsS3Service = module.get<AwsS3Service>(AwsS3Service);
        uploadImageService = module.get<UploadImageService>(UploadImageService);

    });

    describe('create', () => {

        it(' FileNotImage ', async () => {

            validatorService.isImage.mockReturnValue(false);
            const file: IFile = {
                buffer: Buffer.from([]),
                encoding: "",
                fieldname: "",
                mimetype: "",
                originalname: "",
                size: 2
            };
            const result = uploadImageService.create(new CreateUploadImageDto(), file)
            let rejected = false
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new FileNotImageException())
            }
            expect(rejected).toBeTruthy();
        });

        it(' susseccfull upload ', async () => {

            validatorService.isImage.mockReturnValue(true);
            const file: IFile = {
                buffer: Buffer.from([]),
                encoding: "",
                fieldname: "",
                mimetype: "",
                originalname: "",
                size: 2
            };
            awsS3Service.uploadImage.mockReturnValue("path");
            uploadImageRepository.save.mockImplementation(async (value) => value);
            const createUploadImageDto = new CreateUploadImageDto();
            createUploadImageDto.type = "type";
            const result = await uploadImageService.create(createUploadImageDto, file)
            expect(result).not.toBeUndefined()
        });
    });

    describe('update', () => {

        it(' Image type wong ', async () => {
            uploadImageRepository.findOne.mockReturnValue(new UploadImageEntity())
            validatorService.isImage.mockReturnValue(false);
            const file: IFile = {
                buffer: Buffer.from([]),
                encoding: "",
                fieldname: "",
                mimetype: "",
                originalname: "",
                size: 2
            };
            const result = uploadImageService.update(new CreateUploadImageDto(), "id", file)
            let rejected = false
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new FileNotImageException())
            }
            expect(rejected).toBeTruthy();
        });

        it(' Image found, updated ', async () => {
            uploadImageRepository.findOne.mockReturnValue(new UploadImageEntity())
            validatorService.isImage.mockReturnValue(true);
            const file: IFile = {
                buffer: Buffer.from([]),
                encoding: "",
                fieldname: "",
                mimetype: "",
                originalname: "",
                size: 2
            };
            awsS3Service.uploadImage.mockReturnValue("path");

            uploadImageRepository.save.mockImplementation(async (value) => value);
            const result = uploadImageService.update(new CreateUploadImageDto(), "id", file)
            expect(result).not.toBeUndefined()
        });

        it(' Image found, updated info not file ', async () => {
            uploadImageRepository.findOne.mockReturnValue(new UploadImageEntity())
            validatorService.isImage.mockReturnValue(true);

            uploadImageRepository.save.mockImplementation(async (value) => value);
            const result = uploadImageService.update(new CreateUploadImageDto(), "id", null)
            expect(result).not.toBeUndefined()
        });

        it(' Image not found, created ', async () => {
            uploadImageRepository.findOne.mockReturnValue()
            validatorService.isImage.mockReturnValue(true);
            const file: IFile = {
                buffer: Buffer.from([]),
                encoding: "",
                fieldname: "",
                mimetype: "",
                originalname: "",
                size: 2
            };
            awsS3Service.uploadImage.mockReturnValue("path");

            uploadImageRepository.save.mockImplementation(async (value) => value);
            const result = uploadImageService.update(new CreateUploadImageDto(), "id", file)
            expect(result).not.toBeUndefined()
        });

    });

    describe('getImageById', () => {
        it(' null id ', async () => {

            const result = uploadImageService.getImageById(undefined)

            expect(result).not.toBeNull();
        });

        it(' notfound ', async () => {
            uploadImageRepository.findOne.mockReturnValue(undefined)

            const result = uploadImageService.getImageById("id")
            let rejected = false
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new NotFoundException('ImageId is not valid'))
            }
            expect(rejected).toBeTruthy();
        });

        it(' found ', async () => {
            const uploadImageEntity = new UploadImageEntity();
            uploadImageRepository.findOne.mockReturnValue(uploadImageEntity)

            const result = await uploadImageService.getImageById("id")
            expect(result).toEqual(uploadImageEntity)
        });
    });
});
