import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
    mockBoardRepository,
    mockBoardUserOrgRepository,
    mockCanvasRepository,
    mockCanvasUserOrgRepository,
    mockCategoryRepository,
    mockUploadImageRepository,
    mockUserRepository,
    mockUserToOrgRepository,
} from '../../__test__/base.repository.spec';
import {
    dateValue,
    globalMockExpectedResult,
    mockUploadImageService,
} from '../../__test__/base.service.specs';
import { userEntity } from '../../auth/__test__/auth.controller.spec';
import { BoardUserOrgRepository } from '../../board-user-org/board-user-org.repository';
import { BoardUserOrgService } from '../../board-user-org/board-user-org.service';
import {
    mockBoardEntity,
    mockCategoryEntity,
    mockImageEntity,
} from '../../board/__test__/board.service.spec';
import { BoardRepository } from '../../board/board.repository';
import { BoardService } from '../../board/board.service';
import { BoardDto } from '../../board/dto/BoardDto';
import { DeleteBoardDto } from '../../board/dto/DeleteBoardDto';
import { CanvasUserOrgRepository } from '../../canvas-user-org/canvas-user-org.repository';
import { CategoryRepository } from '../../category/category.repository';
import { UploadImageRepository } from '../../upload/upload-image.repository';
import { UploadImageService } from '../../upload/upload-image.service';
import { UserToOrgRepository } from '../../user-org/user-org.repository';
import { UserRepository } from '../../user/user.repository';
import { CanvasEntity } from '../canvas.entity';
import { CanvasRepository } from '../canvas.repository';
import { CanvasService } from '../canvas.service';
import { CreateCanvasDto } from '../dto/CreateCanvasDto';
import { UpdateCanvasDto } from '../dto/UpdateCanvasDto';
import Mocked = jest.Mocked;
import { DeleteCanvasDto } from '../dto/DeleteCanvasDto';
import { CanvasUserOrgEntity } from '../../canvas-user-org/canvas-user-org.entity';
import { CanvasUserOrgDto } from '../../canvas-user-org/dto/CanvasUserOrgDto';

/* eslint-disable @typescript-eslint/unbound-method */

export const mockCanvasEntity: CanvasEntity = {
    id: 'id',
    categoryId: 'testCategory',
    name: 'board',
    toDto() {
        return {
            imageId: '',
            data: '',
            categoryId: mockCategoryEntity.id,
            name: '',
            orgId: '',
            createdUserId: 'createdUserId',
            id: 'id',
        };
    },
    createdAt: dateValue,
    createdUserId: 'id',
    data: '',
    imageId: 'image',
    orgId: 'org',
    updatedAt: dateValue,
    dtoClass: BoardDto,
    canvases: [{ userId: '' } as any],
};
export const mockCreateCanvasDto: CreateCanvasDto = {
    orgId: 'org',
    name: 'name',
    imageId: 'imageId',
    data: 'data',
    categoryId: 'categoryId',
    path: '',
};
export const mockUpdateCanvasDto: UpdateCanvasDto = {
    orgId: 'org',
    name: 'name',
    imageId: 'imageId',
    data: 'data',
    categoryId: 'categoryId',
    path: '',
    id: 'id',
};

describe('CanvasService', () => {
    let boardRepository;
    let userToOrgRepository;
    let boardUserOrgRepository;
    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let canvasRepository;
    let userRepository;
    let boardService: BoardService;
    let canvasService: CanvasService;
    let canvasUserOrgRepository: Mocked<CanvasUserOrgRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                { provide: BoardRepository, useFactory: mockBoardRepository },
                {
                    provide: UserToOrgRepository,
                    useFactory: mockUserToOrgRepository,
                },
                {
                    provide: BoardUserOrgRepository,
                    useFactory: mockBoardUserOrgRepository,
                },
                {
                    provide: UploadImageRepository,
                    useFactory: mockUploadImageRepository,
                },
                {
                    provide: CategoryRepository,
                    useFactory: mockCategoryRepository,
                },
                {
                    provide: UploadImageService,
                    useFactory: mockUploadImageService,
                },
                { provide: CanvasRepository, useFactory: mockCanvasRepository },
                {
                    provide: CanvasUserOrgRepository,
                    useFactory: mockCanvasUserOrgRepository,
                },
                { provide: UserRepository, useFactory: mockUserRepository },
                CanvasService,
                BoardService,
                BoardUserOrgService,
            ],
        }).compile();

        boardRepository = module.get<BoardRepository>(BoardRepository);
        userToOrgRepository = module.get<UserToOrgRepository>(
            UserToOrgRepository,
        );
        boardUserOrgRepository = module.get<BoardUserOrgRepository>(
            BoardUserOrgRepository,
        );
        uploadImageRepository = module.get<UploadImageRepository>(
            UploadImageRepository,
        );
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        canvasRepository = module.get<CanvasRepository>(CanvasRepository);
        boardService = module.get<BoardService>(BoardService);
        canvasService = module.get<CanvasService>(CanvasService);
        userRepository = module.get<UserRepository>(UserRepository);
        canvasUserOrgRepository = module.get(CanvasUserOrgRepository);
    });

    describe('isAdminOrEditor', () => {
        it('Find and return userToOrg ', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            const result = await boardService.isAdminOrEditor(
                'testUser',
                'testOrg',
            );
            expect(result).toEqual(globalMockExpectedResult);
        });

        it('isAdminOrEditor throws UnauthorizedException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(null),
            }));

            await expect(
                canvasService.isAdminOrEditor('testUser', 'testOrg'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
    describe('checkPermissionInBoard', () => {
        it('should return CanvasUserOrg instance if relation found', async () => {
            const canvasUserOrg = ({
                userId: 'userId',
                canvasId: 'canvasId',
                orgId: 'orgId',
            } as unknown) as CanvasUserOrgDto;

            canvasUserOrgRepository.createQueryBuilder.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn(() => canvasUserOrg),
            } as any);

            await expect(
                canvasService.checkPermissionInBoard(
                    canvasUserOrg.userId,
                    canvasUserOrg.canvasId,
                    canvasUserOrg.orgId,
                ),
            ).resolves.toEqual(canvasUserOrg);
        });

        it('should throw unauthorized exception if relation not found', async () => {
            const canvasUserOrg = {
                userId: 'userId',
                canvasId: 'canvasId',
                orgId: 'orgId',
            };

            canvasUserOrgRepository.createQueryBuilder.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null),
            } as any);

            await expect(
                canvasService.checkPermissionInBoard(
                    canvasUserOrg.userId,
                    canvasUserOrg.canvasId,
                    canvasUserOrg.userId,
                ),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
    describe('getById', () => {
        it(' return  one object and not undefined ', async () => {
            boardRepository.findOne.mockReturnValue([mockBoardEntity]);
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await canvasService.getById('id');

            expect(result).not.toBeUndefined();

            expect(result.name).toEqual(mockBoardEntity.toDto().name);
        });

        it('return  one object that path is empty string and category is null', async () => {
            boardRepository.findOne.mockReturnValue([mockBoardEntity]);
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            categoryRepository.findOne.mockReturnValue(null);
            uploadImageRepository.findOne.mockReturnValue(null);

            const result = await canvasService.getById('id');

            expect(result).not.toBeUndefined();

            expect(result.name).toEqual(mockBoardEntity.toDto().name);
            expect(result.path).toBe('');
        });

        it(' throws NotFoundException', async () => {
            canvasRepository.findOne.mockReturnValue(undefined);

            await expect(canvasService.getById('invalidId')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
    describe('getByOrgId', () => {
        it(' return [] with one object and not undefined ', async () => {
            canvasRepository.find.mockReturnValue([mockCanvasEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await canvasService.getByOrgId('id');

            expect(result).not.toBeUndefined();
        });

        it('return [] with one object that category and path is empty ', async () => {
            canvasRepository.find.mockReturnValue([mockCanvasEntity]);
            categoryRepository.findOne.mockReturnValue(null);
            uploadImageRepository.findOne.mockReturnValue(null);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await canvasService.getByOrgId('id');

            expect(result).not.toBeUndefined();
        });

        it(' return [] with Zero object and not undefined', async () => {
            canvasRepository.find.mockReturnValue([]);

            const result = await canvasService.getByOrgId('invalidId');

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);
        });
    });
    describe('create', () => {
        it(' Create with data', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            canvasRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );

            const result = await canvasService.create(
                'id',
                mockCreateCanvasDto,
            );

            expect(result).not.toBeUndefined();
        });

        it(' Create with default values', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            canvasRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(null);
            boardUserOrgRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );

            const result = await canvasService.create(
                'id',
                {} as any,
            );

            expect(result).not.toBeUndefined();
        });
    });

    describe('Update', () => {
        it('Update canvas entity, successfull', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            canvasRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            const result = await canvasService.update(
                'id',
                mockUpdateCanvasDto,
            );

            expect(result).not.toBeUndefined();
        });

        it('Update canvas entity, do not touch fields', async () => {
            canvasRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(null);
            boardUserOrgRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            canvasRepository.findOne.mockReturnValue(mockCanvasEntity);
            const result = await canvasService.update(
                'id',
                {} as any,
            );

            expect(result).not.toBeUndefined();
        });

        it('Update canvas entity, Throw NotFoundException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation((value) =>
                Promise.resolve(value),
            );
            canvasRepository.findOne.mockReturnValue(undefined);

            await expect(
                canvasService.update('id', mockUpdateCanvasDto),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw unauthorized if user is trying to update without permission', async () => {
            const canvasUserOrg = ({
                userId: 'userId',
                canvasId: 'canvasId',
                orgId: 'orgId',
            } as unknown) as UpdateCanvasDto;

            canvasRepository.findOne.mockResolvedValue({
                id: 'canvasId',
                createdUserId: 'ownerId',
            } as any);
            jest.spyOn(
                canvasService,
                'checkPermissionInBoard',
            ).mockImplementationOnce(() => {
                throw new UnauthorizedException();
            });

            await expect(
                canvasService.update('userId', canvasUserOrg),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('delete', () => {
        it('delete canvas entity, successfully', async () => {
            const deleteDto: DeleteCanvasDto = {
                canvasId: 'canvasId',
                orgId: 'orgId',
            };
            const userId = 'userId';

            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            canvasRepository.delete.mockResolvedValue({ affected: 1 } as any);

            await expect(
                canvasService.delete(userId, deleteDto),
            ).resolves.toBeUndefined();

            expect(canvasUserOrgRepository.delete).toBeCalledWith({
                ...deleteDto,
            });
        });
    });
});
