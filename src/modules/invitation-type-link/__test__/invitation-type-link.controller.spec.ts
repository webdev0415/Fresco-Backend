import { Test } from '@nestjs/testing';

import { mockInvitationTypeLinkService } from '../../__test__/base.service.specs';
import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';
import { InvitationTypeLinkController } from '../invitation-type-link.controller';
import { InvitationTypeLinkService } from '../invitation-type-link.service';
import { UserEntity } from '../../user/user.entity';
import { InvitationTypeLinkDto } from '../dto/InvitationTypeLinkDto';
import Mocked = jest.Mocked;

/* eslint-disable @typescript-eslint/unbound-method */

describe('InvitationTypeLinkController', () => {
    let invitationTypeLinkController: Mocked<InvitationTypeLinkController>;
    let invitationTypeLinkService: Mocked<InvitationTypeLinkService>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: InvitationTypeLinkService,
                    useFactory: mockInvitationTypeLinkService,
                },
                InvitationTypeLinkController,
            ],
        }).compile();

        invitationTypeLinkController = module.get(InvitationTypeLinkController);
        invitationTypeLinkService = module.get(InvitationTypeLinkService);
    });

    it('should create new invitation type link', async () => {
        invitationTypeLinkService.create.mockResolvedValueOnce({
            token: 'token',
            toDto() {
                return {
                    token: this.token,
                };
            },
        } as any);

        await expect(
            invitationTypeLinkController.create({} as any, {} as any),
        ).resolves.toEqual({
            token: 'token',
        });
    });

    it('should handle request appropriately', async () => {
        invitationTypeLinkService.handleRequest.mockResolvedValueOnce({
            token: 'token',
            toDto() {
                return {
                    token: this.token,
                };
            },
        } as any);

        await expect(
            invitationTypeLinkController.handleRequest({} as any, {} as any),
        ).resolves.toEqual({
            token: 'token',
        });
    });

    it('should return invitation type link by type and org id', async () => {
        const user = ({ id: 'userId' } as unknown) as UserEntity;
        const dto = {
            type: InvitationType.CANVAS,
            orgId: 'orgId',
            typeId: 'typeId',
        };
        const output = [{ id: 'linkId' }] as any;

        invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId.mockResolvedValueOnce(
            output,
        );

        await expect(
            invitationTypeLinkController.getInvitationTypeLinkByTypeAndOrgId(
                user,
                dto,
            ),
        ).resolves.toEqual(output);

        expect(
            invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId,
        ).toBeCalledWith(user.id, { ...dto, dtoClass: InvitationTypeLinkDto });
    });

    it('should delete entity', async () => {
        invitationTypeLinkService.delete.mockResolvedValueOnce({
            affected: 1,
        } as any);

        await expect(
            invitationTypeLinkController.delete(
                { id: 'userId' } as any,
                'linkId',
            ),
        ).resolves.toEqual({
            affected: 1,
        });

        expect(invitationTypeLinkService.delete).toBeCalledWith({
            invitationTypeLinkId: 'linkId',
            createdUserId: 'userId',
        });
    });

    it('should return user organizations of board id', async () => {
        invitationTypeLinkService.getUsersInType.mockResolvedValueOnce([
            {
                id: 1,
            },
        ] as any);

        await expect(
            invitationTypeLinkController.getUserOrgByBoard(
                { id: 'userId' } as any,
                'typeId',
            ),
        ).resolves.toEqual([{ id: 1 }]);

        expect(invitationTypeLinkService.getUsersInType).toBeCalledWith(
            InvitationType.BOARD,
            'typeId',
        );
    });

    it('should return user organizations of canvas id', async () => {
        invitationTypeLinkService.getUsersInType.mockResolvedValueOnce([
            {
                id: 1,
            },
        ] as any);

        await expect(
            invitationTypeLinkController.getUserOrgByCanvas(
                { id: 'userId' } as any,
                'typeId',
            ),
        ).resolves.toEqual([{ id: 1 }]);

        expect(invitationTypeLinkService.getUsersInType).toBeCalledWith(
            InvitationType.CANVAS,
            'typeId',
        );
    });

    it('should update invitation canvas link', async () => {
        invitationTypeLinkService.update.mockResolvedValueOnce({
            id: 1,
        } as any);

        await expect(
            invitationTypeLinkController.updateInvitationCanvasLink(
                {
                    id: 'userId',
                } as any,
                'linkId',
                { permission: PermissionEnum.ADMIN } as any,
            ),
        ).resolves.toEqual({ id: 1 });

        expect(invitationTypeLinkService.update).toBeCalledWith({
            id: 'linkId',
            type: InvitationType.CANVAS,
            createdUserId: 'userId',
            permission: PermissionEnum.ADMIN,
        });
    });

    it('should update invitation board link', async () => {
        invitationTypeLinkService.update.mockResolvedValueOnce({
            id: 1,
        } as any);

        await expect(
            invitationTypeLinkController.updateInvitationBoardLink(
                {
                    id: 'userId',
                } as any,
                'linkId',
                { permission: PermissionEnum.ADMIN } as any,
            ),
        ).resolves.toEqual({ id: 1 });

        expect(invitationTypeLinkService.update).toBeCalledWith({
            id: 'linkId',
            type: InvitationType.BOARD,
            createdUserId: 'userId',
            permission: PermissionEnum.ADMIN,
        });
    });

    it('should return links of canvas type', async () => {
        invitationTypeLinkService.getLinkByTypeId.mockResolvedValueOnce({
            id: 1,
        } as any);

        await expect(
            invitationTypeLinkController.getLinkByCanvas(
                {
                    id: 'userId',
                } as any,
                'linkId',
            ),
        ).resolves.toEqual({ id: 1 });

        expect(invitationTypeLinkService.getLinkByTypeId).toBeCalledWith(
            InvitationType.CANVAS,
            'linkId',
        );
    });

    it('should return links of board type', async () => {
        invitationTypeLinkService.getLinkByTypeId.mockResolvedValueOnce({
            id: 1,
        } as any);

        await expect(
            invitationTypeLinkController.getLinkByBoard(
                {
                    id: 'userId',
                } as any,
                'linkId',
            ),
        ).resolves.toEqual({ id: 1 });

        expect(invitationTypeLinkService.getLinkByTypeId).toBeCalledWith(
            InvitationType.BOARD,
            'linkId',
        );
    });
});
