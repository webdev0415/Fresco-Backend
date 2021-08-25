import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';

import {
    mockBoardRepository,
    mockBoardUserOrgRepository,
    mockCanvasRepository,
    mockCanvasUserOrgRepository,
    mockInvitationTypeLinkRepository,
    mockOrganizationRepository,
    mockUserRepository,
    mockUserToOrgRepository,
} from '../../__test__/base.repository.spec';
import {
    mockCanvasService,
    mockInvitationTypeLinkUserService,
} from '../../__test__/base.service.specs';
import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';
import { mockConfigService } from '../../../shared/__test__/base.service.specs';
import { ConfigService } from '../../../shared/services/config.service';
import { BoardUserOrgRepository } from '../../board-user-org/board-user-org.repository';
import { BoardEntity } from '../../board/board.entity';
import { BoardRepository } from '../../board/board.repository';
import { CanvasUserOrgRepository } from '../../canvas-user-org/canvas-user-org.repository';
import { CanvasEntity } from '../../canvas/canvas.entity';
import { CanvasRepository } from '../../canvas/canvas.repository';
import { CanvasService } from '../../canvas/canvas.service';
import { InvitationTypeLinkUserService } from '../../invitation-type-link-user/invitation-type-link-user.service';
import { OrganizationEntity } from '../../organization/organization.entity';
import { OrganizationRepository } from '../../organization/organization.repository';
import { UserToOrgEntity } from '../../user-org/user-org.entity';
import { UserToOrgRepository } from '../../user-org/user-org.repository';
import { UserRepository } from '../../user/user.repository';
import { HandleRequestInvitationLinkDto } from '../dto/HandleRequestInvitationLinkDto';
import { InvitationTypeLinkDto } from '../dto/InvitationTypeLinkDto';
import { InvitationTypeLinkEntity } from '../invitation-type-link.entity';
import { InvitationTypeLinkRepository } from '../invitation-type-link.repository';
import { InvitationTypeLinkService } from '../invitation-type-link.service';
import { CanvasUserOrgDto } from '../../canvas-user-org/dto/CanvasUserOrgDto';
import { BoardUserOrgDto } from '../../board-user-org/dto/BoardUserOrgDto';
import { InvitationAcceptedException } from '../../../exceptions/accepted-invitation';
import { UserToOrgDto } from '../../user-org/dto/user-orgDto';
import { omit } from 'lodash';
import Mocked = jest.Mocked;
import { InvitationLimitedException } from '../../../exceptions/invitation-limited';

/* eslint-disable @typescript-eslint/unbound-method,no-invalid-this */

const mockOrganizationEntity = mocked(({
    id: 'orgId',
} as unknown) as OrganizationEntity);

const mockBoardEntity = mocked(({
    id: 'boardId',
} as unknown) as BoardEntity);

const mockCanvasEntity = mocked(({
    id: 'canvasId',
} as unknown) as CanvasEntity);

const mockUserToOrgEntity = mocked(({
    userId: 'userId',
    orgId: 'orgId',
} as unknown) as UserToOrgEntity);

describe('InvitationTypeLinkService', () => {
    let invitationTypeLinkService: Mocked<InvitationTypeLinkService>;
    let invitationTypeLinkRepository: Mocked<InvitationTypeLinkRepository>;
    let invitationTypeLinkUserService: Mocked<InvitationTypeLinkUserService>;
    let boardRepository: Mocked<BoardRepository>;
    let canvasRepository: Mocked<CanvasRepository>;
    let organizationRepository: Mocked<OrganizationRepository>;
    let canvasService: Mocked<CanvasService>;
    let configService: Mocked<ConfigService>;
    let userToOrgRepository: Mocked<UserToOrgRepository>;
    let canvasUserOrgRepository: Mocked<CanvasUserOrgRepository>;
    let boardUserOrgRepository: Mocked<BoardUserOrgRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: InvitationTypeLinkRepository,
                    useFactory: mockInvitationTypeLinkRepository,
                },
                { provide: CanvasService, useFactory: mockCanvasService },
                {
                    provide: OrganizationRepository,
                    useFactory: mockOrganizationRepository,
                },
                { provide: CanvasRepository, useFactory: mockCanvasRepository },
                { provide: BoardRepository, useFactory: mockBoardRepository },
                { provide: ConfigService, useFactory: mockConfigService },
                {
                    provide: InvitationTypeLinkUserService,
                    useFactory: mockInvitationTypeLinkUserService,
                },
                {
                    provide: BoardUserOrgRepository,
                    useFactory: mockBoardUserOrgRepository,
                },
                {
                    provide: CanvasUserOrgRepository,
                    useFactory: mockCanvasUserOrgRepository,
                },
                { provide: UserRepository, useFactory: mockUserRepository },
                {
                    provide: UserToOrgRepository,
                    useFactory: mockUserToOrgRepository,
                },
                InvitationTypeLinkService,
            ],
        }).compile();

        invitationTypeLinkService = module.get(InvitationTypeLinkService);
        invitationTypeLinkRepository = module.get(InvitationTypeLinkRepository);
        boardRepository = module.get(BoardRepository);
        canvasRepository = module.get(CanvasRepository);
        organizationRepository = module.get(OrganizationRepository);
        canvasService = module.get(CanvasService);
        invitationTypeLinkUserService = module.get(
            InvitationTypeLinkUserService,
        );
        configService = module.get(ConfigService);
        userToOrgRepository = module.get(UserToOrgRepository);
        canvasUserOrgRepository = module.get(CanvasUserOrgRepository);
        boardUserOrgRepository = module.get(BoardUserOrgRepository);
    });

    describe('create', () => {
        it('should create canvas InvitationTypeLink entity successfully when type is canvas', async () => {
            const createInvitationTypeLinkDto = {
                token: 'token',
                type: InvitationType.CANVAS,
                orgId: 'orgId',
                createdUserId: 'userId',
                permission: PermissionEnum.LIMITED,
                typeId: 'typeId',
                numberOfUser: 0,
            };

            organizationRepository.findOne.mockResolvedValueOnce(
                mockOrganizationEntity,
            );
            canvasService.isAdminOrEditor.mockResolvedValueOnce(
                mockUserToOrgEntity,
            );
            canvasRepository.findOne.mockResolvedValueOnce(mockCanvasEntity);
            invitationTypeLinkRepository.save.mockImplementationOnce((e) =>
                Promise.resolve(e as InvitationTypeLinkEntity),
            );

            await expect(
                invitationTypeLinkService.create(
                    'userId',
                    createInvitationTypeLinkDto,
                ),
            ).resolves.toEqual({
                ...createInvitationTypeLinkDto,
                isDeleted: false,
                dtoClass: InvitationTypeLinkDto,
            });
        });

        it('should create board InvitationTypeLink entity successfully when type is board', async () => {
            const createInvitationTypeLinkDto = {
                token: 'token',
                type: InvitationType.BOARD,
                orgId: 'orgId',
                createdUserId: 'userId',
                permission: PermissionEnum.LIMITED,
                typeId: 'typeId',
                numberOfUser: 0,
            };

            organizationRepository.findOne.mockResolvedValueOnce(
                mockOrganizationEntity,
            );
            canvasService.isAdminOrEditor.mockResolvedValueOnce(
                mockUserToOrgEntity,
            );
            boardRepository.findOne.mockResolvedValueOnce(mockBoardEntity);
            invitationTypeLinkRepository.save.mockImplementationOnce((e) =>
                Promise.resolve(e as InvitationTypeLinkEntity),
            );

            await expect(
                invitationTypeLinkService.create(
                    'userId',
                    createInvitationTypeLinkDto,
                ),
            ).resolves.toEqual({
                ...createInvitationTypeLinkDto,
                isDeleted: false,
                dtoClass: InvitationTypeLinkDto,
            });
        });

        it('should throw NotFoundException if organization not found', async () => {
            organizationRepository.findOne.mockResolvedValueOnce(null);

            await expect(
                invitationTypeLinkService.create('userId', {} as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if typeId not found', async () => {
            organizationRepository.findOne.mockResolvedValueOnce(
                mockOrganizationEntity,
            );
            canvasService.isAdminOrEditor.mockResolvedValueOnce(
                mockUserToOrgEntity,
            );
            canvasRepository.findOne.mockResolvedValueOnce(null);

            await expect(
                invitationTypeLinkService.create('userId', {} as any),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('handleRequest', () => {
        const handleRequestInvitationLinkDto: HandleRequestInvitationLinkDto = {
            token: 'token',
        };

        it('should add user relation to org and canvas', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.CANVAS,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.EDITOR,
            } as unknown) as InvitationTypeLinkEntity);

            const userId = 'otherUserId';

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) => e as any,
            );
            invitationTypeLinkUserService.getInvitationTypeLinkUser.mockResolvedValueOnce(
                null,
            );
            configService.getNumber.mockReturnValue(20);
            userToOrgRepository.findOne.mockResolvedValueOnce(null);
            canvasUserOrgRepository.save.mockImplementationOnce(
                (e) => e as any,
            );

            await expect(
                invitationTypeLinkService.handleRequest(
                    userId,
                    handleRequestInvitationLinkDto,
                ),
            ).resolves.toEqual({
                ...mockInvitationTypeLinkEntity,
                numberOfUser: mockInvitationTypeLinkEntity.numberOfUser + 1,
            });

            expect(canvasUserOrgRepository.save).toBeCalledTimes(1);
            expect(canvasUserOrgRepository.save).toBeCalledWith({
                userId,
                canvasId: mockInvitationTypeLinkEntity.typeId,
                orgId: mockInvitationTypeLinkEntity.orgId,
                permission: mockInvitationTypeLinkEntity.permission,
                dtoClass: CanvasUserOrgDto,
            });
            expect(userToOrgRepository.save).toBeCalledTimes(1);
            expect(userToOrgRepository.save).toBeCalledWith({
                userId,
                orgId: mockInvitationTypeLinkEntity.orgId,
                permission: mockInvitationTypeLinkEntity.permission,
                dtoClass: UserToOrgDto,
            });
        });

        it('should add user relation to org and board', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.BOARD,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.EDITOR,
            } as unknown) as InvitationTypeLinkEntity);

            const userId = 'otherUserId';

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) => e as any,
            );
            invitationTypeLinkUserService.getInvitationTypeLinkUser.mockResolvedValueOnce(
                null,
            );
            configService.getNumber.mockReturnValue(20);
            userToOrgRepository.findOne.mockResolvedValueOnce(null);
            boardUserOrgRepository.save.mockImplementationOnce((e) => e as any);

            await expect(
                invitationTypeLinkService.handleRequest(
                    userId,
                    handleRequestInvitationLinkDto,
                ),
            ).resolves.toEqual({
                ...mockInvitationTypeLinkEntity,
                numberOfUser: mockInvitationTypeLinkEntity.numberOfUser + 1,
            });

            expect(boardUserOrgRepository.save).toBeCalledTimes(1);
            expect(boardUserOrgRepository.save).toBeCalledWith({
                userId,
                boardId: mockInvitationTypeLinkEntity.typeId,
                orgId: mockInvitationTypeLinkEntity.orgId,
                permission: mockInvitationTypeLinkEntity.permission,
                dtoClass: BoardUserOrgDto,
            });
        });

        it('should add user to only board if org relation exists', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.BOARD,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.ADMIN,
            } as unknown) as InvitationTypeLinkEntity);

            const userId = 'otherUserId';

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) => e as any,
            );
            invitationTypeLinkUserService.getInvitationTypeLinkUser.mockResolvedValueOnce(
                null,
            );
            configService.getNumber.mockReturnValue(20);
            userToOrgRepository.findOne.mockResolvedValueOnce({
                id: 'id',
            } as any);
            boardUserOrgRepository.save.mockImplementationOnce((e) => e as any);

            await expect(
                invitationTypeLinkService.handleRequest(
                    userId,
                    handleRequestInvitationLinkDto,
                ),
            ).resolves.toEqual({
                ...mockInvitationTypeLinkEntity,
                numberOfUser: mockInvitationTypeLinkEntity.numberOfUser + 1,
            });

            expect(userToOrgRepository.save).toBeCalledTimes(0);
        });

        it('should throw token is not valid if no invitation found', async () => {
            const userId = 'otherUserId';
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(null);

            await expect(
                invitationTypeLinkService.handleRequest(
                    userId,
                    handleRequestInvitationLinkDto,
                ),
            ).rejects.toThrow(new NotFoundException('token is not valid'));
        });

        it('should throw you created this invitation if user is owner', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.BOARD,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.ADMIN,
            } as unknown) as InvitationTypeLinkEntity);

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );

            await expect(
                invitationTypeLinkService.handleRequest(
                    mockInvitationTypeLinkEntity.createdUserId,
                    handleRequestInvitationLinkDto,
                ),
            ).rejects.toThrow(
                new InvitationAcceptedException('You created this invitation'),
            );
        });

        it('should throw you accepted if user accepted invitation', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.BOARD,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.ADMIN,
            } as unknown) as InvitationTypeLinkEntity);

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );

            invitationTypeLinkUserService.getInvitationTypeLinkUser.mockResolvedValueOnce(
                {} as any,
            );

            await expect(
                invitationTypeLinkService.handleRequest(
                    'anotherUserId',
                    handleRequestInvitationLinkDto,
                ),
            ).rejects.toThrow(
                new InvitationAcceptedException('You accepted this invitation'),
            );
        });

        it('should throw invitation limit is reached if it reached', async () => {
            const mockInvitationTypeLinkEntity = mocked(({
                id: 'invitationTypeLinkId',
                createdUserId: 'userId',
                numberOfUser: 10,
                type: InvitationType.BOARD,
                typeId: 'typeId',
                orgId: 'orgId',
                permission: PermissionEnum.ADMIN,
            } as unknown) as InvitationTypeLinkEntity);

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(
                mockInvitationTypeLinkEntity,
            );
            invitationTypeLinkUserService.getInvitationTypeLinkUser.mockResolvedValueOnce(
                null,
            );
            configService.getNumber.mockReturnValueOnce(10);

            await expect(
                invitationTypeLinkService.handleRequest(
                    'otherUserId',
                    handleRequestInvitationLinkDto,
                ),
            ).rejects.toThrow(
                new InvitationLimitedException('Invitation is limited'),
            );
        });
    });

    describe('getInvitationTypeLinkByTypeAndOrgId', () => {
        it('should return invitations of type canvas for specific org', async () => {
            const item = {
                id: 'id1',
                token: 'token1',
                orgId: 'orgId1',
                createdUserId: 'createdUserId1',
                permission: 'permission1',
                numberOfUser: 'numberOfUser1',
                type: 'type1',
                typeId: 'typeId1',
                isDeleted: 'isDeleted1',
                organization: 'organization1',
                canvas: {
                    id: 'canvasId1',
                },
            };

            invitationTypeLinkRepository.createQueryBuilder.mockReturnValueOnce(
                {
                    innerJoinAndSelect: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    getMany: jest.fn().mockResolvedValue([item]),
                } as any,
            );

            await expect(
                invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId(
                    'userId',
                    { type: InvitationType.CANVAS } as any,
                ),
            ).resolves.toEqual([
                {
                    ...omit(item, 'canvas'),
                    boardOrCanvas: item.canvas,
                },
            ]);
        });

        it('should return invitations of type board for specific org', async () => {
            const item = {
                id: 'id1',
                token: 'token1',
                orgId: 'orgId1',
                createdUserId: 'createdUserId1',
                permission: 'permission1',
                numberOfUser: 'numberOfUser1',
                type: 'type1',
                typeId: 'typeId1',
                isDeleted: 'isDeleted1',
                organization: 'organization1',
                board: {
                    id: 'boardId',
                },
            };

            invitationTypeLinkRepository.createQueryBuilder.mockReturnValueOnce(
                {
                    innerJoinAndSelect: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    getMany: jest.fn().mockResolvedValue([item]),
                } as any,
            );

            await expect(
                invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId(
                    'userId',
                    { type: InvitationType.BOARD } as any,
                ),
            ).resolves.toEqual([
                {
                    ...omit(item, 'board'),
                    boardOrCanvas: item.board,
                },
            ]);
        });
    });

    describe('delete', () => {
        it('should set deleted flag on invitation link to true', async () => {
            const mockInvitationTypeLinkEntity = {
                id: 'id',
                createdUserId: 'userId',
                isDeleted: false,
            };

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce({
                ...mockInvitationTypeLinkEntity,
            } as any);
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) =>
                    ({
                        ...e,
                        toDto: jest.fn(() => ({
                            id: e.id,
                            createdUserId: e.createdUserId,
                            isDeleted: e.isDeleted,
                        })),
                    } as any),
            );

            await expect(
                invitationTypeLinkService.delete({
                    invitationTypeLinkId: mockInvitationTypeLinkEntity.id,
                    createdUserId: mockInvitationTypeLinkEntity.createdUserId,
                }),
            ).resolves.toEqual({
                id: mockInvitationTypeLinkEntity.id,
                createdUserId: mockInvitationTypeLinkEntity.createdUserId,
                isDeleted: true,
            });
            expect(invitationTypeLinkRepository.save).toBeCalledWith({
                id: mockInvitationTypeLinkEntity.id,
                createdUserId: mockInvitationTypeLinkEntity.createdUserId,
                isDeleted: true,
            });
        });

        it('should throw not found if invitation cannot be found', async () => {
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(null);

            await expect(
                invitationTypeLinkService.delete({
                    invitationTypeLinkId: 'id',
                    createdUserId: 'createdUserId',
                }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getUsersInType', () => {
        it('should return users of canvas type', async () => {
            const canvasItem = {
                user: {
                    email: 'johndoe@gmail.com',
                    name: 'john',
                },
                permission: PermissionEnum.EDITOR,
                organization: {
                    name: 'org1',
                    fName: 'joe',
                    lName: 'doe',
                },
            };

            canvasUserOrgRepository.createQueryBuilder.mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([canvasItem]),
            } as any);

            await expect(
                invitationTypeLinkService.getUsersInType(
                    InvitationType.CANVAS,
                    'canvasId',
                ),
            ).resolves.toEqual([
                {
                    email: canvasItem.user.email,
                    name: canvasItem.user.name,
                    permission: canvasItem.permission,
                    organizationName: canvasItem.organization.name,
                    lName: canvasItem.organization.lName,
                    fName: canvasItem.organization.fName,
                },
            ]);

            expect(canvasUserOrgRepository.createQueryBuilder).toBeCalledWith(
                'canvas_user_org',
            );
        });

        it('should return users of board type', async () => {
            const boardItem = {
                user: {
                    email: 'johndoe@gmail.com',
                    name: 'john',
                },
                permission: PermissionEnum.EDITOR,
                organization: {
                    name: 'org1',
                    fName: 'joe',
                    lName: 'doe',
                },
            };

            boardUserOrgRepository.createQueryBuilder.mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([boardItem]),
            } as any);

            await expect(
                invitationTypeLinkService.getUsersInType(
                    InvitationType.BOARD,
                    'boardId',
                ),
            ).resolves.toEqual([
                {
                    email: boardItem.user.email,
                    name: boardItem.user.name,
                    permission: boardItem.permission,
                    organizationName: boardItem.organization.name,
                    lName: boardItem.organization.lName,
                    fName: boardItem.organization.fName,
                },
            ]);

            expect(boardUserOrgRepository.createQueryBuilder).toBeCalledWith(
                'board_user_org',
            );
        });
    });

    describe('update', () => {
        it('should update invitation permission', async () => {
            const invitationTypeLinkUpdateDto = {
                id: 'id',
                type: InvitationType.CANVAS,
                createdUserId: 'userId',
                permission: PermissionEnum.EDITOR,
            };

            function toDto() {
                return {
                    id: this.id,
                    type: this.type,
                    createdUserId: this.createdUserId,
                    permission: this.permission,
                };
            }
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce({
                toDto,
                ...invitationTypeLinkUpdateDto,
                permission: PermissionEnum.ADMIN,
            } as any);
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) => Promise.resolve(e) as any,
            );

            await expect(
                invitationTypeLinkService.update(
                    invitationTypeLinkUpdateDto as any,
                ),
            ).resolves.toEqual({
                ...invitationTypeLinkUpdateDto,
            });

            expect(invitationTypeLinkRepository.save).toBeCalledWith({
                ...invitationTypeLinkUpdateDto,
                toDto,
            });
        });

        it('should not touch invitation permission', async () => {
            const invitationTypeLinkUpdateDto = {
                id: 'id',
                type: InvitationType.CANVAS,
                createdUserId: 'userId',
            };

            function toDto() {
                return {
                    id: this.id,
                    type: this.type,
                    createdUserId: this.createdUserId,
                    permission: this.permission,
                };
            }
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce({
                toDto,
                ...invitationTypeLinkUpdateDto,
                permission: PermissionEnum.EDITOR,
            } as any);
            invitationTypeLinkRepository.save.mockImplementationOnce(
                (e) => Promise.resolve(e) as any,
            );

            await expect(
                invitationTypeLinkService.update(
                    invitationTypeLinkUpdateDto as any,
                ),
            ).resolves.toEqual({
                ...invitationTypeLinkUpdateDto,
                permission: PermissionEnum.EDITOR,
            });

            expect(invitationTypeLinkRepository.save).toBeCalledWith({
                ...invitationTypeLinkUpdateDto,
                permission: PermissionEnum.EDITOR,
                toDto,
            });
        });

        it('should throw not found exception if type entity does not exist', async () => {
            const invitationTypeLinkUpdateDto = {
                id: 'id',
                type: InvitationType.CANVAS,
                createdUserId: 'userId',
                permission: PermissionEnum.EDITOR,
            };

            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(null);
            await expect(
                invitationTypeLinkService.update(
                    invitationTypeLinkUpdateDto as any,
                ),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getLinkByTypeId', () => {
        it('should return link by type id', async () => {
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce({
                token: 'token',
                toDto() {
                    return {
                        token: this.token,
                    };
                },
            } as any);

            await expect(
                invitationTypeLinkService.getLinkByTypeId(
                    InvitationType.CANVAS,
                    'id',
                ),
            ).resolves.toEqual({
                token: 'token',
            });
        });

        it('should throw exception if type id not found', async () => {
            invitationTypeLinkRepository.findOne.mockResolvedValueOnce(null);

            await expect(
                invitationTypeLinkService.getLinkByTypeId(
                    InvitationType.CANVAS,
                    'id',
                ),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
