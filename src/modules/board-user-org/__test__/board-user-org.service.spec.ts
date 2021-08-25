import { Test } from '@nestjs/testing';
import { BoardUserOrgRepository } from '../board-user-org.repository';
import { mocked } from 'ts-jest/utils';
import { BoardUserOrgService } from '../board-user-org.service';
import { PermissionEnum } from '../../../common/constants/permission';
import { BoardUserOrgDto } from '../dto/BoardUserOrgDto';
import Mocked = jest.Mocked;

/* eslint-disable @typescript-eslint/unbound-method */

const mockBoardUserOrgRepository = () =>
    mocked({
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        save: jest.fn(),
    });

describe('BoardUserOrgService', () => {
    let boardUserOrgService: BoardUserOrgService;
    let boardUserOrgRepository: Mocked<BoardUserOrgRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: BoardUserOrgRepository,
                    useFactory: mockBoardUserOrgRepository,
                },
                BoardUserOrgService,
            ],
        }).compile();

        boardUserOrgService = module.get(BoardUserOrgService);
        boardUserOrgRepository = module.get(BoardUserOrgRepository);
    });

    it('should add new collaborator to board', async () => {
        boardUserOrgRepository.save.mockImplementation(
            (entity) => Promise.resolve(entity) as any,
        );
        boardUserOrgRepository.findOne.mockResolvedValue(null);

        const arg = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
            permission: PermissionEnum.EDITOR,
            dtoClass: BoardUserOrgDto,
        };

        await expect(
            boardUserOrgService.AddCollaborator(
                arg.boardId,
                arg.orgId,
                arg.userId,
                arg.permission,
            ),
        ).resolves.toEqual(arg);
    });

    it("should change collaborator's permissions if already exists", async () => {
        const boardUserOrgEntity = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
            permission: PermissionEnum.VIEW,
            dtoClass: BoardUserOrgDto,
        };

        boardUserOrgRepository.save.mockImplementation(
            (entity) => Promise.resolve(entity) as any,
        );
        boardUserOrgRepository.findOne.mockResolvedValue({
            ...boardUserOrgEntity,
        } as any);

        await expect(
            boardUserOrgService.AddCollaborator(
                boardUserOrgEntity.boardId,
                boardUserOrgEntity.orgId,
                boardUserOrgEntity.userId,
                PermissionEnum.EDITOR,
            ),
        ).resolves.toEqual({
            ...boardUserOrgEntity,
            permission: PermissionEnum.EDITOR,
        });
    });

    it('should remove collaborator', async () => {
        const boardUserOrgEntity = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
            permission: PermissionEnum.VIEW,
            dtoClass: BoardUserOrgDto,
        };

        boardUserOrgRepository.remove.mockResolvedValue({ affected: 1 } as any);
        boardUserOrgRepository.findOne.mockResolvedValue({
            ...boardUserOrgEntity,
        } as any);

        await expect(
            boardUserOrgService.RemoveCollaborator(
                boardUserOrgEntity.boardId,
                boardUserOrgEntity.orgId,
                boardUserOrgEntity.userId,
            ),
        ).resolves.toBeTruthy();

        expect(boardUserOrgRepository.remove).toBeCalledTimes(1);
        expect(boardUserOrgRepository.remove).toBeCalledWith(
            boardUserOrgEntity,
        );
    });

    it('should return false when removing collaboration that not exists', async () => {
        const boardUserOrgEntity = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
            permission: PermissionEnum.VIEW,
            dtoClass: BoardUserOrgDto,
        };

        boardUserOrgRepository.findOne.mockResolvedValue(null);

        await expect(
            boardUserOrgService.RemoveCollaborator(
                boardUserOrgEntity.boardId,
                boardUserOrgEntity.orgId,
                boardUserOrgEntity.userId,
            ),
        ).resolves.toBeFalsy();
    });

    it('should change collaboration permission', async () => {
        const boardUserOrgEntity = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
            permission: PermissionEnum.VIEW,
            dtoClass: BoardUserOrgDto,
        };

        boardUserOrgRepository.save.mockImplementation(
            (e) => Promise.resolve(e) as any,
        );
        boardUserOrgRepository.findOne.mockResolvedValue(
            boardUserOrgEntity as any,
        );

        await expect(
            boardUserOrgService.ChangePermission(
                boardUserOrgEntity.boardId,
                boardUserOrgEntity.orgId,
                boardUserOrgEntity.userId,
                PermissionEnum.ADMIN,
            ),
        ).resolves.toEqual({
            ...boardUserOrgEntity,
            permission: PermissionEnum.ADMIN,
        });
    });

    it('should do nothing on change permission if user not found', async () => {
        const arg = {
            boardId: 'boardId',
            orgId: 'orgId',
            userId: 'userId',
        };

        boardUserOrgRepository.findOne.mockResolvedValue(null);

        await expect(
            boardUserOrgService.ChangePermission(
                arg.boardId,
                arg.orgId,
                arg.userId,
                PermissionEnum.ADMIN,
            ),
        ).resolves.toBeUndefined();
    });

    it('should return all boards', async () => {
        const items = [
            {
                boardId: 'boardId',
                orgId: 'orgId',
                userId: 'userId',
            },
        ] as any;

        boardUserOrgRepository.find.mockResolvedValue(items);

        await expect(
            boardUserOrgService.GetAllBoards('userId', 'boardId'),
        ).resolves.toEqual(items);
    });
});
