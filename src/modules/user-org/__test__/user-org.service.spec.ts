import { Test } from '@nestjs/testing';

import { mockUserToOrgRepository } from '../../__test__/base.repository.spec';
import { UserToOrgRepository } from '../user-org.repository';
import { UserToOrgService } from '../user-org.service';

describe('UserOrgService', () => {
    it('should be instantiated', async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: UserToOrgRepository,
                    useFactory: mockUserToOrgRepository,
                },
                UserToOrgService,
            ],
        }).compile();

        const userToOrgService = module.get(UserToOrgService);

        expect(userToOrgService).not.toBeUndefined();
    });
});
