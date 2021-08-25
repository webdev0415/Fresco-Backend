/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';

import { mockCanvasService } from '../../__test__/base.service.specs';
import { userEntity } from '../../auth/__test__/auth.controller.spec';
import { CanvasController } from '../canvas.controller';
import { CanvasService } from '../canvas.service';
import { CreateCanvasDto } from '../dto/CreateCanvasDto';
import { DeleteCanvasDto } from '../dto/DeleteCanvasDto';
import { UpdateCanvasDto } from '../dto/UpdateCanvasDto';
import { mockCanvasEntity } from './canvas.service.spec';

const mockCache = () => ({});

describe('CanvasController', () => {
    let canvasController: CanvasController;
    let canvasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CanvasController,

                { provide: CanvasService, useFactory: mockCanvasService },
            ],
        }).compile();

        canvasService = module.get<CanvasService>(CanvasService);
        canvasController = module.get<CanvasController>(CanvasController);
    });

    describe('get list Canvas by Canvas id', () => {
        it('should return Canvas entity', async () => {
            canvasService.getById.mockResolvedValue(mockCanvasEntity);
            const result = await canvasController.getCanvas('id');
            expect(result).toEqual(mockCanvasEntity);
        });
    });

    describe('get list Canvas by orgId', () => {
        it('should return Canvas entity list', async () => {
            canvasService.getByOrgId.mockResolvedValue([mockCanvasEntity]);
            const result = await canvasController.get('id');
            expect(result).toHaveLength(1);
        });
    });

    describe('create Canvas', () => {
        it('should return createCanvasDto', async () => {
            const createCanvasDto: CreateCanvasDto = new CreateCanvasDto();

            canvasService.create.mockResolvedValue(createCanvasDto);
            const result = await canvasController.create(
                userEntity,
                createCanvasDto,
            );
            expect(result).toEqual(createCanvasDto);
        });
    });
    describe('update Canvas', () => {
        it('should return CanvasDto', async () => {
            const createCanvasDto: UpdateCanvasDto = new UpdateCanvasDto();

            canvasService.update.mockResolvedValue(mockCanvasEntity);
            const result = await canvasController.update(
                userEntity,
                '',
                createCanvasDto,
            );
            expect(result).toEqual(mockCanvasEntity);
        });
    });
    describe('delete Canvas', () => {
        it('should return void', async () => {
            canvasService.delete.mockResolvedValue(mockCanvasEntity);
            const result = await canvasController.delete(
                userEntity,
                '',
                new DeleteCanvasDto(),
            );
            expect(result).toBeFalsy();
        });
    });
});
