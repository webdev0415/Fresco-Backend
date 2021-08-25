import { Test } from '@nestjs/testing';

import { UserController } from '../user-org.controller';

describe('UserOrgService', () => {
    it('should be instantiated', async () => {
        const module = await Test.createTestingModule({
            providers: [UserController],
        }).compile();

        const userController = module.get(UserController);

        expect(userController).not.toBeUndefined();
    });
});
