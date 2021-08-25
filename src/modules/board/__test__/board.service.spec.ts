import {Test} from '@nestjs/testing';
import {UtilsService} from '../../../providers/utils.service';
import {CreateBoardDto} from "../dto/CreateBoardDto";
import {UpdateBoardDto} from "../dto/UpdateBoardDto";
import {DeleteBoardDto} from "../dto/DeleteBoardDto";
import {BoardUserOrgRepository} from "../../board-user-org/board-user-org.repository";
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {UploadImageRepository} from "../../upload/upload-image.repository";
import {CategoryRepository} from "../../category/category.repository";
import {UploadImageService} from "../../upload/upload-image.service";
import {BoardRepository} from "../board.repository";
import {BoardService} from "../board.service";
import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {BoardEntity} from "../board.entity";
import {CategoryEntity} from "../../category/category.entity";
import {UploadImageEntity} from "../../upload/upload-image.entity";
import {CategoryDto} from "../../category/dto/CategoryDto";
import {UploadImageDto} from "../../upload/dto/UploadImageDto";
import {BoardDto} from "../dto/BoardDto";
import {UserRepository} from "../../user/user.repository";
import {mockUserRepository} from "../../__test__/base.repository.spec";
import {userEntity} from "../../auth/__test__/auth.controller.spec";
import {BoardUserOrgService} from "../../board-user-org/board-user-org.service";
import {UserEntity} from "../../user/user.entity";
import {UserDto} from "../../user/dto/UserDto";
import {RoleType} from "../../../common/constants/role-type";
import {PermissionEnum} from "../../../common/constants/permission";


export const mockCreateBoard: CreateBoardDto = {
    categoryId: "1234",
    data: "test",
    imageId: "test",
    name: "testName",
    orgId: "testOrg"
};

export const mockUpdateBoard: UpdateBoardDto = {
    categoryId: "1234",
    data: "test",
    imageId: "test",
    name: "testName",
    orgId: "testOrg", id: "id"
};

export const mockDeleteBoardDto: DeleteBoardDto = {
    boardId: "testBoard",
    orgId: "testOrg",
    userId: "testUser"
};

export const mockCreateBoardDto: CreateBoardDto = {
    orgId: "org", name: "name", imageId: "imageId", data: "data", categoryId: "categoryId"

}

export const mockUpdateBoardDto: UpdateBoardDto = {
    orgId: "org", name: "name", imageId: "imageId", data: "data", categoryId: "categoryId", id: ""

}

export const createMockUserEntity = (): UserEntity => {
    const user: UserEntity = {
        id: 'id',
        name: 'John',
        createdAt: new Date(),
        email: 'johndoe@gmail.com',
        verified: true,
        password: '12345',
        googleId: 'goog132',
        role: RoleType.USER,
        dtoClass: UserDto,
        toDto: null,
    };

    user.toDto = UserEntity.prototype.toDto.bind(user);
    return user;
};

const dateValue = new Date();

export const mockCategoryEntity: CategoryEntity = {
    id: "id", name: "category", imageId: "image", toDto: (): CategoryDto => {
        return {id: "id", imageId: "imageId", name: "category"}
    }
    , createdAt: dateValue, dtoClass: CategoryDto, updatedAt: dateValue
}

export const mockImageEntity: UploadImageEntity = {
    id: "imageId", type: "type", path: "path", toDto: () => {
        return {}
    }, updatedAt: dateValue, createdAt: dateValue, dtoClass: UploadImageDto
}
export const mockBoardEntity: BoardEntity = {
    id: "id",
    categoryId: "testCategory",
    name: "board",
    toDto: () => {
        let info = {
            imageId: "",
            data: "",
            categoryId: mockCategoryEntity.id,
            path: mockImageEntity.path,
            category: mockCategoryEntity,
            name: "",
            orgId: ""

        }

        return info;
    },
    createdAt: dateValue,
    createdUserId: "id",
    data: "",
    imageId: "image",
    orgId: "org",
    updatedAt: dateValue,
    dtoClass: BoardDto,boards:[{userId:""} as any]

}


const mockCategoryRepository = () => ({
    findOne: jest.fn(), find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    dispose: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnThis(),
    })),
})
const mockBoardRepository = mockCategoryRepository

const mockUserToOrgRepository = mockCategoryRepository

const mockBoardUserOrgRepository = mockCategoryRepository

const mockUploadImageRepository = mockCategoryRepository


const mockUploadImageService = () => ({
    getImageById: jest.fn(),

});

const mockBoardUserOrgService = () => ({
    GetAllBoards: jest.fn(),
});

const mockEditorUserToOrgEntity = {
    id: 'id',
    userId: 'userId1',
    orgId: 'orgId',
    permission: PermissionEnum.EDITOR,
};

const mockLimitedUserToOrgEntity = {
    id: 'id',
    userId: 'userId2',
    orgId: 'orgId',
    permission: PermissionEnum.LIMITED,
};

const globalMockExpectedResult = {};

describe('BoardService', () => {
    let boardRepository;
    let userToOrgRepository;
    let boardUserOrgRepository;
    let uploadImageRepository;
    let categoryRepository;
    let uploadImageService;
    let userRepository;
    let boardService: BoardService;
    let boardUserOrgService;

    beforeEach(async () => {
        UtilsService.validateHash = jest.fn().mockResolvedValue(true);
        const module = await Test.createTestingModule({
            providers: [

                {provide: BoardRepository, useFactory: mockBoardRepository},
                {provide: UserToOrgRepository, useFactory: mockUserToOrgRepository},
                {provide: BoardUserOrgRepository, useFactory: mockBoardUserOrgRepository},
                {provide: UploadImageRepository, useFactory: mockUploadImageRepository},
                {provide: CategoryRepository, useFactory: mockCategoryRepository},
                {provide: UploadImageService, useFactory: mockUploadImageService},
                {provide: UserRepository, useFactory: mockUserRepository},
                {provide: BoardUserOrgService, useFactory: mockBoardUserOrgService},

                // { provide: BoardService, useFactory: mockBoardService },
                BoardService
            ],
        }).compile();


        boardRepository = module.get<BoardRepository>(BoardRepository);
        userToOrgRepository = module.get<UserToOrgRepository>(UserToOrgRepository);
        boardUserOrgRepository = module.get<BoardUserOrgRepository>(BoardUserOrgRepository);
        uploadImageRepository = module.get<UploadImageRepository>(UploadImageRepository);
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        userRepository = module.get<UserRepository>(UserRepository);
        boardService = module.get<BoardService>(BoardService);
        boardUserOrgService = module.get(BoardUserOrgService);
    });

    describe('isAdminOrEditor', () => {

        it('Find and return userToOrg ', async () => {

            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            const result = await boardService.isAdminOrEditor("testUser", "testOrg")
            expect(result).toEqual(globalMockExpectedResult);
        });


        it('isAdminOrEditor throws UnauthorizedException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(null),
            }));

            await expect(
                boardService.isAdminOrEditor('testUser', 'testOrg'),
            ).rejects.toThrow(UnauthorizedException);
        });


    });

    describe('GetById', () => {


        it(' return BoardInfoDto and not undefined ', async () => {

            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            userRepository.findOne.mockReturnValue(createMockUserEntity());
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);

            const result = await boardService.getById("id")
            expect(result).not.toEqual(undefined)
            expect(result.categoryId).toEqual(mockCategoryEntity.id)
            expect(result.path).toEqual(mockImageEntity.path)

        });

        it(' return BoardInfoDto that does not have category and path ', async () => {

            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            userRepository.findOne.mockReturnValue(createMockUserEntity());
            categoryRepository.findOne.mockReturnValue(null);
            uploadImageRepository.findOne.mockReturnValue(null);

            const result = await boardService.getById("id")
            expect(result).not.toEqual(undefined)
            expect(result.category).toBe(null)
            expect(result.path).toBe('')

        });

        it(' throws NotFoundException ', async () => {

            boardRepository.findOne.mockReturnValue(undefined);

            try {
                await boardService.getById("id")
            } catch (e) {
                expect(e).toEqual(new NotFoundException())
            }

        });
    });

    describe('getByOrgId', () => {


        it(' return BoardInfoDto[] with one object and not undefined ', async () => {

            boardRepository.find.mockReturnValue([mockBoardEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await boardService.getByOrgId("id")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].categoryId).toEqual(mockCategoryEntity.id)
            expect(result[0]["path"]).toEqual(mockImageEntity.path)

        });

        it(' return BoardInfoDto[] with Zero object and not undefined', async () => {

            boardRepository.find.mockReturnValue([]);

            const result = await boardService.getByOrgId("invalidId")

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(0);

        });
    });

    describe('getByOrgIdAndUserId', () => {
        it('return all of organization boards for access user', async () => {
            userToOrgRepository.findOne.mockReturnValue(
                mockEditorUserToOrgEntity,
            );
            boardRepository.find.mockReturnValue([mockBoardEntity]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await boardService.getByOrgIdAndUserId(
                'userId',
                'orgId',
            );

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].categoryId).toEqual(mockCategoryEntity.id);
            expect(result[0].path).toEqual(mockImageEntity.path);
        });

        it('return only boards with access for limited user', async () => {
            userToOrgRepository.findOne.mockReturnValue(
                mockLimitedUserToOrgEntity,
            );
            boardUserOrgService.GetAllBoards.mockReturnValue([
                { board: mockBoardEntity },
            ]);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageRepository.findOne.mockReturnValue(mockImageEntity);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await boardService.getByOrgIdAndUserId(
                'userId2',
                'orgId',
            );

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].categoryId).toEqual(mockCategoryEntity.id);
            expect(result[0].path).toEqual(mockImageEntity.path);
        });

        it('return only boards with access for limited user (for boards without image and category)', async () => {
            userToOrgRepository.findOne.mockReturnValue(
                mockLimitedUserToOrgEntity,
            );
            boardUserOrgService.GetAllBoards.mockReturnValue([
                { board: mockBoardEntity },
            ]);
            categoryRepository.findOne.mockReturnValue(null);
            uploadImageRepository.findOne.mockReturnValue(null);
            userRepository.findOne.mockReturnValue(userEntity);

            const result = await boardService.getByOrgIdAndUserId(
                'userId2',
                'orgId',
            );

            expect(result).not.toBeUndefined();
            expect(result.length).toEqual(1);
            expect(result[0].category).toEqual(null);
            expect(result[0].path).toEqual('');
        });
    });

    describe('create', () => {


        it(' Create with data', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));

            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)

            const result = await boardService.create("id", mockCreateBoardDto)

            expect(result).not.toBeUndefined();


        });

        it(' Create with default values', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(null);
            uploadImageService.getImageById.mockReturnValue(null);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)

            const result = await boardService.create("id", {} as any)

            expect(result).not.toBeUndefined();
        });

    });

    describe('Update', () => {


        it('Update board entity, successfull', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(mockCategoryEntity);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)
            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            const result = await boardService.update("id", mockUpdateBoardDto)


            expect(result).not.toBeUndefined();


        });

        it('Update board entity, do not touch fields', async () => {
            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(null);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)
            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            const result = await boardService.update("id", {} as any)

            expect(result).not.toBeUndefined();
        });

        it('Update board entity, Throw NotFoundException', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)
            boardRepository.findOne.mockReturnValue(undefined);

            await expect(
                boardService.update('id', mockUpdateBoardDto),
            ).rejects.toThrow(NotFoundException);
        });

        it('update board that is not owner', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardUserOrgRepository.createQueryBuilder = jest
                .fn()
                .mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
                });
            boardRepository.save.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.save.mockImplementation(async (value) => value)
            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            const result = await boardService.update('otherId', mockUpdateBoardDto)

            expect(result).not.toBeUndefined();
        })
    });

    describe('delete', () => {


        it('delete board entity, successfull', async () => {
            userToOrgRepository.createQueryBuilder = jest.fn(() => ({
                andWhere: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(globalMockExpectedResult),
            }));
            boardRepository.delete.mockImplementation(async (value) => value);
            categoryRepository.findOne.mockReturnValue(undefined);
            uploadImageService.getImageById.mockReturnValue(mockImageEntity);
            boardUserOrgRepository.delete.mockImplementation(async (value) => value)
            boardRepository.findOne.mockReturnValue(mockBoardEntity);
            const result = await boardService.delete(new DeleteBoardDto())

            expect(result).toBeUndefined()


        });

    });

    describe('checkPermissionInBoard', () => {
        it('return relation if permission granted', async () => {
            const boardUserOrg = {
                userId: 'userId',
                orgId: 'orgId',
            };

            boardUserOrgRepository.createQueryBuilder.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(boardUserOrg),
            });

            const result = boardService.checkPermissionInBoard(
                'userId',
                'boardId',
                'orgId',
            );
            await expect(result).resolves.toEqual(boardUserOrg);
        });

        it('throw UnauthorizedException if permission not granted', async () => {
            boardUserOrgRepository.createQueryBuilder.mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValue(null),
            });

            const result = boardService.checkPermissionInBoard(
                'userId',
                'boardId',
                'orgId',
            );
            await expect(result).rejects.toThrow(UnauthorizedException);
        });
    });
});
