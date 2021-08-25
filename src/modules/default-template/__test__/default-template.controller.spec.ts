/* eslint-disable @typescript-eslint/no-unused-vars */

import {DefaultTemplateEntity} from "../default-template.entity";
import {DefaultTemplateController} from "../default-template.controller";
import {Test} from "@nestjs/testing";
import {DefaultTemplateService} from "../default-template.service";
import {CreateDefaultTemplateDto} from "../dto/CreateDefaultTemplateDto";
import {UpdateDefaultTemplateDto} from "../dto/UpdateDefaultTemplateDto";
import {mockDefaultTemplateService} from "../../__test__/base.service.specs";

let mockDefaultTemplateEntity: DefaultTemplateEntity = new DefaultTemplateEntity();


describe('DefaultTemplateController', () => {

    let defaultTemplateController: DefaultTemplateController;
    let defaultTemplateService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                DefaultTemplateController,
                {provide: DefaultTemplateService, useFactory: mockDefaultTemplateService},
            ],
        }).compile();

        defaultTemplateController = module.get<DefaultTemplateController>(DefaultTemplateController);
        defaultTemplateService = module.get<DefaultTemplateService>(DefaultTemplateService);

    });



    describe('get list DefaultTemplate ', () => {
        it('should return DefaultTemplate entity list', async () => {
            defaultTemplateService.get.mockResolvedValue([mockDefaultTemplateEntity]);
            let result = await defaultTemplateController.get();
            expect(result).toHaveLength(1)
        });
    });

    describe('create DefaultTemplate', () => {
        it('should return createDefaultTemplateDto', async () => {
            let createDefaultTemplateDto: CreateDefaultTemplateDto = new CreateDefaultTemplateDto();

            defaultTemplateService.create.mockResolvedValue(createDefaultTemplateDto);
            let result = await defaultTemplateController.create(createDefaultTemplateDto);
            expect(result).toEqual(createDefaultTemplateDto)
        });
    });
    describe('update DefaultTemplate', () => {
        it('should return DefaultTemplateDto', async () => {
            let createDefaultTemplateDto: UpdateDefaultTemplateDto = new UpdateDefaultTemplateDto();

            defaultTemplateService.update.mockResolvedValue(mockDefaultTemplateEntity);
            let result = await defaultTemplateController.update("", createDefaultTemplateDto);
            expect(result).toEqual(mockDefaultTemplateEntity)
        });
    });
    describe('delete DefaultTemplate', () => {
        it('should return void', async () => {

            defaultTemplateService.delete.mockResolvedValue(mockDefaultTemplateEntity);
            let result = await defaultTemplateController.delete("");
            expect(result).toBeFalsy()

        });
    });


});
