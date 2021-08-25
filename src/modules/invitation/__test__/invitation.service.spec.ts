import { Test } from '@nestjs/testing';
import { UserToOrgRepository } from '../../user-org/user-org.repository';
import { CategoryRepository } from '../../category/category.repository';
import { UploadImageService } from '../../upload/upload-image.service';

import { UnauthorizedException } from '@nestjs/common';
import {
    mockBoardUserOrgRepository,
    mockCanvasUserOrgRepository,
    mockCategoryRepository,
    mockInvitationRepository,
    mockUserToOrgRepository,
} from '../../__test__/base.repository.spec';

import { AuthService } from '../../auth/auth.service';
import { MailService } from '../../mail/mail.service';
import { InvitationService } from '../invitation.service';
import { UserToOrgEntity } from '../../user-org/user-org.entity';
import { PermissionEnum } from '../../../common/constants/permission';
import { InvitationRepository } from '../invitation.repository';
import { SendInvitationDto } from '../dto/SendInvitationDto';
import { InvitationEntity } from '../invitation.entity';
import { UserEntity } from '../../user/user.entity';
import { InvitationNotValidException } from '../../../exceptions/invitaion-not-found.exception';
import { VerifyTokenDto } from '../dto/VerifyTokenDto';
import { LoginPayloadDto } from '../../auth/dto/LoginPayloadDto';
import {
    mockAuthService,
    mockMailService,
    mockUploadImageService,
} from '../../__test__/base.service.specs';
import { BoardUserOrgRepository } from '../../board-user-org/board-user-org.repository';
import { CanvasUserOrgRepository } from '../../canvas-user-org/canvas-user-org.repository';
import { InVitationTypeEmailDto } from '../dto/InvitationTypeEmailDto';
import { InvitationType } from '../../../common/constants/invitation-type';
import Mocked = jest.Mocked;
import { UserToOrgDto } from '../../user-org/dto/user-orgDto';
import { CanvasUserOrgDto } from '../../canvas-user-org/dto/CanvasUserOrgDto';
import { BoardUserOrgDto } from '../../board-user-org/dto/BoardUserOrgDto';

/* eslint-disable @typescript-eslint/unbound-method */

describe('Invitation Service', () => {
    let userToOrgRepository;
    let categoryRepository;
    let uploadImageService;

    let authService;
    let mailService;
    let invitationRepository;
    let invitationService: InvitationService;
    let canvasUserOrgRepository: Mocked<CanvasUserOrgRepository>;
    let boardUserOrgRepository: Mocked<BoardUserOrgRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: UserToOrgRepository,
                    useFactory: mockUserToOrgRepository,
                },
                {
                    provide: InvitationRepository,
                    useFactory: mockInvitationRepository,
                },
                {
                    provide: UserToOrgRepository,
                    useFactory: mockUserToOrgRepository,
                },
                {
                    provide: CategoryRepository,
                    useFactory: mockCategoryRepository,
                },
                { provide: AuthService, useFactory: mockAuthService },
                { provide: MailService, useFactory: mockMailService },
                {
                    provide: BoardUserOrgRepository,
                    useFactory: mockBoardUserOrgRepository,
                },
                {
                    provide: CanvasUserOrgRepository,
                    useFactory: mockCanvasUserOrgRepository,
                },
                { provide: MailService, useFactory: mockMailService },
                {
                    provide: UploadImageService,
                    useFactory: mockUploadImageService,
                },
                InvitationService,
            ],
        }).compile();
        userToOrgRepository = module.get<UserToOrgRepository>(
            UserToOrgRepository,
        );

        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        uploadImageService = module.get<UploadImageService>(UploadImageService);
        invitationRepository = module.get<InvitationRepository>(
            InvitationRepository,
        );
        authService = module.get<AuthService>(AuthService);
        mailService = module.get<MailService>(MailService);
        invitationService = module.get<InvitationService>(InvitationService);
        canvasUserOrgRepository = module.get(CanvasUserOrgRepository);
        boardUserOrgRepository = module.get(BoardUserOrgRepository);
    });

    describe('checkPermission', () => {
        it(' return  true ', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN;

            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            const result = await invitationService.checkPermission(
                'frpmId',
                'toId',
            );

            expect(result).not.toBeUndefined();

            expect(result).toBeTruthy();
        });

        it(' return  false , notfound ', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN;

            userToOrgRepository.findOne.mockReturnValue(undefined);

            const result = await invitationService.checkPermission(
                'frpmId',
                'toId',
            );

            expect(result).not.toBeUndefined();

            expect(result).toBeFalsy();
        });

        it(' return  false , no permission ', async () => {
            let userToOrgEntity = new UserToOrgEntity();

            userToOrgRepository.findOne.mockReturnValue(undefined);

            const result = await invitationService.checkPermission(
                'frpmId',
                'toId',
            );

            expect(result).not.toBeUndefined();

            expect(result).toBeFalsy();
        });
    });

    describe('create', () => {
        it(' Create with data, invalid permission', async () => {
            let userToOrgEntity = new UserToOrgEntity();

            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            const result = invitationService.create(
                'id',
                new SendInvitationDto(),
            );

            let rejected = false;
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new UnauthorizedException());
            }
            expect(rejected).toBeTruthy();
        });
        it(' resend for existing invite', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN;
            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(invitationEntity);
            invitationRepository.save.mockImplementation(
                async (value) => value,
            );

            mailService.sendInvitationEmail.mockReturnThis();

            const result = await invitationService.create(
                'id',
                new SendInvitationDto(),
            );
            expect(result).toEqual(invitationEntity);
        });
        it(' new invite', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN;
            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = false;
            invitationRepository.findOne = jest
                .fn(async () => invitationEntity)
                .mockImplementationOnce(async () => undefined);

            invitationRepository.save.mockImplementation(
                async (value) => value,
            );

            mailService.sendInvitationEmail.mockReturnThis();
            authService.getUserByEmail.mockReturnValue(new UserEntity());

            const result = await invitationService.create(
                'id',
                new SendInvitationDto(),
            );
            expect(result).toHaveProperty('token');
        });

        it(' new invite for non-existing user', async () => {
            const userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN;
            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            const invitationEntity = new InvitationEntity();
            invitationEntity.verified = false;
            invitationEntity.organization = { name: 'org '} as any;
            invitationRepository.findOne = jest
                .fn(async () => invitationEntity)
                .mockImplementationOnce(async () => undefined);

            invitationRepository.save.mockImplementation(
                async (value) => value,
            );

            mailService.sendInvitationEmail.mockReturnThis();
            authService.getUserByEmail.mockReturnValue(null);

            const result = await invitationService.create(
                'id',
                new SendInvitationDto(),
            );
            expect(result).toHaveProperty('token');
        });
    });
    describe('resendInvitation', () => {
        it('successful', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(invitationEntity);
            invitationRepository.save.mockImplementation(
                async (value) => value,
            );

            mailService.sendInvitationEmail.mockReturnThis();
            const result = await invitationService.resendInvitation('id');
            expect(result).toEqual(invitationEntity);
        });

        it('successful with org name', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgRepository.findOne.mockReturnValue(userToOrgEntity);

            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationEntity.organization = { name: 'org' } as any;
            invitationRepository.findOne.mockReturnValue(invitationEntity);
            invitationRepository.save.mockImplementation(
                async (value) => value,
            );

            mailService.sendInvitationEmail.mockReturnThis();
            const result = await invitationService.resendInvitation('id');
            expect(result).toEqual(invitationEntity);
        });
    });
    describe('checkValidToken', () => {
        it(' Exist ,Valid ', async () => {
            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(invitationEntity);

            const result = await invitationService.checkValidToken('id');

            expect(result).toEqual(invitationEntity);
        });

        it(' Not Exist ,inValid ', async () => {
            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(undefined);

            const result = invitationService.checkValidToken('id');
            let rejected = false;
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new InvitationNotValidException());
            }
            expect(rejected).toBeTruthy();
        });
    });

    describe('updateToVerified', () => {
        it(' Exist ,Valid ', async () => {
            let invitationEntity = new InvitationEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(invitationEntity);
            invitationRepository.update.mockReturnThis();
            userToOrgRepository.save.mockImplementation(async (value) => value);

            await invitationService.updateToVerified(new VerifyTokenDto());
        });
    });

    describe('verify', () => {
        it('verify valid Token ', async () => {
            let invitationEntity = new InvitationEntity();
            invitationEntity.userInvite = new UserEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(invitationEntity);
            invitationRepository.update.mockReturnThis();
            userToOrgRepository.save.mockImplementation(async (value) => value);

            let result = await invitationService.verify(new VerifyTokenDto());

            expect(
                new LoginPayloadDto(invitationEntity.userInvite.toDto(), {
                    accessToken: 'token',
                    expiresIn: 200,
                }),
            ).toEqual(result);
        });

        it('verify inValid Token ', async () => {
            let invitationEntity = new InvitationEntity();
            invitationEntity.userInvite = new UserEntity();
            invitationEntity.verified = true;
            invitationRepository.findOne.mockReturnValue(undefined);

            let result = invitationService.verify(new VerifyTokenDto());

            let rejected = false;
            try {
                const response = await result;
            } catch (e) {
                rejected = true;
                expect(e).toEqual(new InvitationNotValidException());
            }
            expect(rejected).toBeTruthy();
        });
    });

    describe('invitationTypeEmails', () => {
        const user = ({ id: 'userId', name: 'john ' } as unknown) as UserEntity;

        it('should add relations to canvas and org to existing user without org access and send email notification', async () => {
            const dto: InVitationTypeEmailDto = {
                invitationEmails: [
                    {
                        orgId: 'orgId',
                        toEmail: 'john@site.com',
                        type: InvitationType.CANVAS,
                        typeId: 'canvasId',
                        permission: PermissionEnum.VIEW,
                    },
                ],
                message: 'You are invited',
                notify: 1,
            };

            authService.getUserByEmail.mockResolvedValue({
                id: 'userId',
            } as any);
            userToOrgRepository.findOne.mockResolvedValue(null);
            canvasUserOrgRepository.createQueryBuilder.mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null),
            } as any);
            await expect(
                invitationService.invitationTypeEmails(user, dto),
            ).resolves.toBeUndefined();

            // UserToOrg relation should be saved
            expect(userToOrgRepository.save).toBeCalledWith({
                orgId: dto.invitationEmails[0].orgId,
                userId: user.id,
                permission: dto.invitationEmails[0].permission,
                dtoClass: UserToOrgDto,
            });

            // CanvasUserOrgRepository should be queries for existing relation
            expect(canvasUserOrgRepository.createQueryBuilder).toBeCalledWith(
                'canvas_user_org',
            );

            // Canvas and user relation should be added
            expect(canvasUserOrgRepository.save).toBeCalledWith({
                canvasId: dto.invitationEmails[0].typeId,
                orgId: dto.invitationEmails[0].orgId,
                permission: dto.invitationEmails[0].permission,
                userId: user.id,
                dtoClass: CanvasUserOrgDto,
            });

            // sendNotificationPeople should be called too
            expect(mailService.sendNotificationPeople).toBeCalledWith(
                [dto.invitationEmails[0].toEmail],
                dto.invitationEmails[0].typeId,
                dto.invitationEmails[0].type,
                dto.message,
                user.name,
            );
        });

        it('should add relations to board to existing user with org access and send email notification', async () => {
            const dto: InVitationTypeEmailDto = {
                invitationEmails: [
                    {
                        orgId: 'orgId',
                        toEmail: 'john@site.com',
                        type: InvitationType.BOARD,
                        typeId: 'boardId',
                        permission: PermissionEnum.VIEW,
                    },
                ],
                message: 'You are invited',
                notify: 1,
            };

            authService.getUserByEmail.mockResolvedValue({
                id: 'userId',
            } as any);
            userToOrgRepository.findOne.mockResolvedValue({} as any);
            boardUserOrgRepository.createQueryBuilder.mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null),
            } as any);

            await expect(
                invitationService.invitationTypeEmails(user, dto),
            ).resolves.toBeUndefined();

            // BoardUserOrgRepository should be queries for existing relation
            expect(boardUserOrgRepository.createQueryBuilder).toBeCalledWith(
                'board_user_org',
            );

            // Board and user relation should be added
            expect(boardUserOrgRepository.save).toBeCalledWith({
                boardId: dto.invitationEmails[0].typeId,
                orgId: dto.invitationEmails[0].orgId,
                permission: dto.invitationEmails[0].permission,
                userId: user.id,
                dtoClass: BoardUserOrgDto,
            });

            // sendNotificationPeople should be called too
            expect(mailService.sendNotificationPeople).toBeCalledWith(
                [dto.invitationEmails[0].toEmail],
                dto.invitationEmails[0].typeId,
                dto.invitationEmails[0].type,
                dto.message,
                user.name,
            );
        });

        it('should terminate function if user already have org and board access', async () => {
            const dto: InVitationTypeEmailDto = {
                invitationEmails: [
                    {
                        orgId: 'orgId',
                        toEmail: 'john@site.com',
                        type: InvitationType.BOARD,
                        typeId: 'boardId',
                        permission: PermissionEnum.VIEW,
                    },
                ],
                message: 'You are invited',
                notify: 1,
            };

            authService.getUserByEmail.mockResolvedValue({
                id: 'userId',
            } as any);
            userToOrgRepository.findOne.mockResolvedValue({} as any);
            boardUserOrgRepository.createQueryBuilder.mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue({} as any),
            } as any);

            await expect(
                invitationService.invitationTypeEmails(user, dto),
            ).resolves.toBeUndefined();

            // BoardUserOrgRepository should be queries for existing relation
            expect(boardUserOrgRepository.createQueryBuilder).toBeCalledWith(
                'board_user_org',
            );

            // Board and user relation should not be added
            expect(boardUserOrgRepository.save).toBeCalledTimes(0);

            // sendNotificationPeople should not be called too
            expect(mailService.sendNotificationPeople).toBeCalledTimes(0);
        });

        it('should create invitation for not existing users', async () => {
            const dto: InVitationTypeEmailDto = {
                invitationEmails: [
                    {
                        orgId: 'orgId',
                        toEmail: 'john@site.com',
                        type: InvitationType.BOARD,
                        typeId: 'boardId',
                        permission: PermissionEnum.VIEW,
                    },
                ],
                message: 'You are invited',
                notify: 1,
            };
            authService.getUserByEmail.mockResolvedValue(null);
            jest.spyOn(invitationService, 'create').mockResolvedValueOnce(
                {} as any,
            );

            await expect(
                invitationService.invitationTypeEmails(user, dto),
            ).resolves.toBeUndefined();

            expect(invitationService.create).toBeCalledWith(user.id, {
                boardId: dto.invitationEmails[0].typeId,
                toEmail: dto.invitationEmails[0].toEmail,
                orgId: dto.invitationEmails[0].orgId,
                permission: PermissionEnum.LIMITED,
                boardPermission: dto.invitationEmails[0].permission,
            });
        });
    });
});
