/* eslint-disable @typescript-eslint/no-unused-vars */

import {UploadImageController} from "../upload-image.controller";
import {UploadImageEntity} from "../upload-image.entity";
import {Test} from "@nestjs/testing";
import {UploadImageService} from "../upload-image.service";
import {UploadImageDto} from "../dto/UploadImageDto";
import {mockUploadImageService} from "../../__test__/base.service.specs";

let mockUploadImageEntity: UploadImageEntity = new UploadImageEntity();
let mockUploadImageDto: UploadImageDto = new UploadImageDto(mockUploadImageEntity);
mockUploadImageEntity.toDto=()=>mockUploadImageDto


describe('UploadImageController', () => {

    let uploadImageController: UploadImageController;
    let uploadImageService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                UploadImageController,
                {provide: UploadImageService, useFactory: mockUploadImageService},
            ],
        }).compile();

        uploadImageController = module.get<UploadImageController>(UploadImageController);
        uploadImageService = module.get<UploadImageService>(UploadImageService);

    });
    describe(' UploadImage ', () => {
        it('should return UploadImage dto', async () => {
            uploadImageService.create.mockResolvedValue(mockUploadImageDto);
            let result = await uploadImageController.uploadFile("",{} as any);
            expect(result).toEqual(mockUploadImageDto)
        });
    });

    describe('update Image ', () => {
        it('should return UploadImage dto', async () => {

            uploadImageService.update.mockResolvedValue(mockUploadImageEntity);
            let result = await uploadImageController.updateImage("","",{} as any);
            expect(result).toEqual(mockUploadImageEntity.toDto())

        });
    });


});
