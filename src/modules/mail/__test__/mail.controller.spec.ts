import { Test } from '@nestjs/testing';

import { mockMailService } from '../../__test__/base.service.specs';
import { MailController } from '../mail.controller';
import { MailService } from '../mail.service';

describe('MailController', () => {
    it('should create MailController', async () => {
        const module = await Test.createTestingModule({
            providers: [
                { provide: MailService, useFactory: mockMailService },
                MailController,
            ],
        }).compile();

        const mailController = module.get(MailController);
        expect(mailController).not.toBeNull();
    });
});
