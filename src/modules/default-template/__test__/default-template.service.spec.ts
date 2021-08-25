

import {Test} from '@nestjs/testing';
import {UtilsService} from '../../../providers/utils.service';
import {UploadImageRepository} from "../../upload/upload-image.repository";
import {CategoryRepository} from "../../category/category.repository";
import {UploadImageService} from "../../upload/upload-image.service";
import {
    mockCategoryRepository,
    mockDefaultTemplateRepository,
    mockUploadImageRepository
} from "../../__test__/base.repository.spec";
import {mockCategoryEntity, mockImageEntity} from "../../board/__test__/board.service.spec";
import {DefaultTemplateService} from "../default-template.service";
import {DefaultTemplateEntity} from "../default-template.entity";
import {DefaultTemplateDto} from "../dto/DefaultTemplateDto";
import {CreateDefaultTemplateDto} from "../dto/CreateDefaultTemplateDto";
import {UpdateDefaultTemplateDto} from "../dto/UpdateDefaultTemplateDto";
import {DefaultTemplateRepository} from "../default-template.repository";
import {NotFoundException} from "@nestjs/common";
import {DeleteDefaultTemplateDto} from "../dto/DeleteDefaultTemplateDto";
import {mockUploadImageService} from "../../__test__/base.service.specs";


export const mockDefaultTemplateEntity: DefaultTemplateEntity = {
    id: "id",
    categoryId: "testCategory",
    name: "board",
    toDto: () => {
        let info: DefaultTemplateDto = {
            imageId: "", data: "", categoryId: mockCategoryEntity.id, name: "", id: "id"

        }

        return info;
    },

    data: "",
    imageId: "image",
    dtoClass: DefaultTemplateDto,

}
export const mockCreateDefaultTemplateDto: CreateDefaultTemplateDto = {
    name: "name", imageId: "imageId", path: "path", categoryId: "categoryId", data: ""
}
export const mockDefaultDefaultTemplateDto: UpdateDefaultTemplateDto = {

    name: "name", imageId: "imageId", path: "path", categoryId: "categoryId", data: "",
    id: "id"
}
describe('Default-Template Service', () => {

    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let defaultTemplateRepository;
    let defaultTemplateService: DefaultTemplateService;

    beforeEach(async () => {
        UtilsService.validateHash = jest.fn().mockResolvedValue(true);
        const module = await Test.createTestingModule({
            providers: [

                {provide: UploadImageRepository, useFactory: mockUploadImageRepository},
                {provide: CategoryRepository, useFactory: mockCategoryRepository},

                {provide: DefaultTemplateRepository, useFactory: mockDefaultTemplateRepository},
                {provide: UploadImageService, useFactory: mockUploadImageService},

                DefaultTemplateService
            ],
        }).compile();

        uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        defaultTemplateRepository = module.get<DefaultTemplateRepository>(DefaultTemplateRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        defaultTemplateService = module.get<DefaultTemplateService>(DefaultTemplateService);
    });


    describe('get', () => {

        it(' return  one object and not undefined ', async () => {
            defaultTemplateRepository.find.mockReturnValue([mockCategoryEntity])

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await defaultTemplateService.get()

            expect(result).not.toBeUndefined();

            expect(result.length).toEqual(1)

        });

        it(' return  Zero object and not undefined', async () => {

            defaultTemplateRepository.find.mockReturnValue([])

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result =await defaultTemplateService.get()
            expect(result).not.toBeUndefined();

            expect(result.length).toEqual(0)

        });

        it(' return object without category and image', async () => {

            defaultTemplateRepository.find.mockReturnValue([mockCategoryEntity])

            categoryRepository.findOne.mockReturnValue(null);
            uploadImageRepository.findOne.mockReturnValue(null);
            const result =await defaultTemplateService.get()

            expect(result).not.toBeUndefined();

            expect(result.length).toEqual(1)

        });
    });


    describe('create', () => {

        it(' Create with data', async () => {

            defaultTemplateRepository.save.mockReturnValue(mockDefaultTemplateEntity);

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);

            const result = await defaultTemplateService.create(mockCreateDefaultTemplateDto)

            expect(result).not.toBeUndefined();

        });

        it(' Create with default data', async () => {

            defaultTemplateRepository.save.mockReturnValue(mockDefaultTemplateEntity);

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(null);

            const result = await defaultTemplateService.create({} as any)

            expect(result).not.toBeUndefined();

        });

    });

    describe('Update', () => {

        it('Update entity, successfull', async () => {

            defaultTemplateRepository.save.mockReturnValue(mockDefaultTemplateEntity);
            defaultTemplateRepository.findOne.mockReturnValue(mockDefaultTemplateEntity);

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);


            const result = await defaultTemplateService.update(mockDefaultDefaultTemplateDto)


            expect(result).not.toBeUndefined();


        });

        it('Update entity, do not touch fields', async () => {

            defaultTemplateRepository.save.mockReturnValue(mockDefaultTemplateEntity);
            defaultTemplateRepository.findOne.mockReturnValue(mockDefaultTemplateEntity);

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(null);

            const result = await defaultTemplateService.update({} as any)

            expect(result).not.toBeUndefined();
        });

        it('Update  entity, Throw NotFoundException', async () => {
            defaultTemplateRepository.save.mockReturnValue(mockDefaultTemplateEntity);
            defaultTemplateRepository.findOne.mockReturnValue(undefined);

            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);


            const result =  defaultTemplateService.update(mockDefaultDefaultTemplateDto)

            let rejected = false
            try {
                const response = await result;

            } catch (e) {
                rejected = true;
                expect(e).toEqual(new NotFoundException())
            }
            expect(rejected).toBeTruthy();

        });
    });

    describe('delete', () => {

        it('delete successfull', async () => {

            defaultTemplateRepository.delete.mockImplementation(async (value) => value);

            const result = await defaultTemplateService.delete(new DeleteDefaultTemplateDto())


            expect(result).toBeUndefined()

        });

    });


});
