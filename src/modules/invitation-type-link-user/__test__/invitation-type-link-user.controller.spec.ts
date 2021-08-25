import { Test } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils';

import { InvitationTypeLinkUserRepository } from '../invitation-type-link-user.repository';
import { InvitationTypeLinkUserService } from '../invitation-type-link-user.service';
import { InvitationTypeLinkUserController } from '../invitation-type-link-user.controller';
import Mocked = jest.Mocked;

const mockInvitationTypeLinkUserService = () => mocked({});

describe('InvitationTypeLinkUserService', () => {
    let invitationTypeLinkUserController: Mocked<InvitationTypeLinkUserController>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: InvitationTypeLinkUserService,
                    useFactory: mockInvitationTypeLinkUserService,
                },
                InvitationTypeLinkUserController,
            ],
        }).compile();

        invitationTypeLinkUserController = module.get(
            InvitationTypeLinkUserController,
        );
    });

    it('should be instantiated', () => {
        expect(invitationTypeLinkUserController).not.toBeUndefined();
    });
});
