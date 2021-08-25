import { Test } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';

import { InvitationTypeLinkUserRepository } from '../invitation-type-link-user.repository';
import { InvitationTypeLinkUserService } from '../invitation-type-link-user.service';
import Mocked = jest.Mocked;
import { InvitationTypeLinkUserDto } from '../dto/InvitationTypeLinkUserDto';

const mockInvitationTypeLinkUserRepository = () =>
    mocked({
        findOne: jest.fn(),
        save: jest.fn(),
    });

describe('InvitationTypeLinkUserService', () => {
    let invitationTypeLinkUserService: Mocked<InvitationTypeLinkUserService>;
    let invitationTypeLinkUserRepository: Mocked<InvitationTypeLinkUserRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: InvitationTypeLinkUserRepository,
                    useFactory: mockInvitationTypeLinkUserRepository,
                },
                InvitationTypeLinkUserService,
            ],
        }).compile();

        invitationTypeLinkUserService = module.get(
            InvitationTypeLinkUserService,
        );
        invitationTypeLinkUserRepository = module.get(
            InvitationTypeLinkUserRepository,
        );
    });

    it('should return InvitationTypeLinkUser entity', async () => {
        const entity = {
            id: 'id',
            invitationTypeLinkId: 'id',
            userId: 'id',
            createdAt: new Date(),
            dtoClass: InvitationTypeLinkUserDto,
            toDto: jest.fn(),
        };

        invitationTypeLinkUserRepository.findOne.mockResolvedValue(entity);
        await expect(
            invitationTypeLinkUserService.getInvitationTypeLinkUser('id', 'id'),
        ).resolves.toBe(entity);
    });

    it('should create new InvitationTypeLinkUser entity', async () => {
        const mockDate = new Date(2020, 1, 1);
        const mockEntity = {
            invitationTypeLinkId: 'id',
            userId: 'id',
            createdAt: mockDate,
            dtoClass: InvitationTypeLinkUserDto,
        };

        invitationTypeLinkUserRepository.save.mockImplementation(
            (entity) => entity as any,
        );
        jest.spyOn(global, 'Date').mockImplementationOnce(
            () => mockDate as any,
        );

        await expect(
            invitationTypeLinkUserService.create({
                userId: mockEntity.userId,
                invitationTypeLinkId: mockEntity.invitationTypeLinkId,
            }),
        ).resolves.toEqual(mockEntity);
    });
});
