import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';

import { RoleType } from '../../../common/constants/role-type';
import { ConfigService } from '../../../shared/services/config.service';
import { UserDto } from '../../user/dto/UserDto';
import { MailService } from '../mail.service';
import {
    SENDGRID_TOKEN,
    SendGridModule,
    SendGridService,
} from '@ntegral/nestjs-sendgrid';
import Mocked = jest.Mocked;
import { mockConfigService } from '../../../shared/__test__/base.service.specs';
import { Templates } from '../../../common/constants/email-templates';
import { SendEmailInvitationDto } from '../../invitation/dto/SendEmailInvitationDto';
import { mocked } from 'ts-jest';
import { InvitationType } from '../../../common/constants/invitation-type';

/* eslint-disable @typescript-eslint/unbound-method */

const mockSendGridService = () =>
    mocked<SendGridService>(({
        send: jest.fn(),
        sendMultiple: jest.fn(),
    } as unknown) as SendGridService);

describe('MailService', () => {
    let client: Mocked<SendGridService>;
    let configService: Mocked<ConfigService>;
    let mailService: MailService;

    const configValues = {
        CLIENT_URL: 'https://site.com',
        EMAIL_FROM: 'mail@site.com',
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [],
            providers: [
                MailService,
                { provide: ConfigService, useFactory: mockConfigService },
                { provide: SENDGRID_TOKEN, useFactory: mockSendGridService },
            ],
        }).compile();

        mailService = module.get(MailService);
        configService = module.get(ConfigService);
        client = module.get(SENDGRID_TOKEN);

        // Mock configService
        configService.get.mockImplementation((key) => configValues[key]);
    });

    describe('sendConfirmationEmail', () => {
        const userDto: UserDto = {
            id: '1',
            email: 'test@gmail.com',
            name: 'test user',
            role: RoleType.USER,
        };

        it('sendConfirmationEmail success', async () => {
            const code = '123ab';

            client.send.mockResolvedValue({ success: true } as any);

            await expect(
                mailService.sendConfirmationEmail(userDto, code),
            ).resolves.toEqual({ success: true });

            expect(client.send).toBeCalledWith({
                to: userDto.email,
                from: configValues.EMAIL_FROM,
                templateId: Templates.CONFIRMATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    url: `${configValues.CLIENT_URL}/auth/confirm/${code}`,
                },
            });
        });

        it('sendConfirmationEmail error', async () => {
            const code = '123ab';

            client.send.mockImplementationOnce(() => {
                throw new Error("Can't send email");
            });
            await expect(
                mailService.sendConfirmationEmail(userDto, code),
            ).rejects.toThrow(new Error("Can't send email"));
        });
    });

    describe('sendInvitationEmail', () => {
        const invitationDto: SendEmailInvitationDto = {
            organizationName: 'orgName',
            email: 'user@site.com',
        };

        it('sendInvitationEmail success', async () => {
            const code = '123ab';

            client.send.mockResolvedValue({ success: true } as any);

            await expect(
                mailService.sendInvitationEmail(invitationDto, code),
            ).resolves.toEqual({ success: true });

            expect(client.send).toBeCalledWith({
                to: invitationDto.email,
                from: configValues.EMAIL_FROM,
                templateId: Templates.INVITATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    url: `${configValues.CLIENT_URL}/invitation/check/${code}`,
                    organization: invitationDto.organizationName,
                },
            });
        });

        it('sendInvitationEmail error', async () => {
            const code = '123ab';

            client.send.mockImplementationOnce(() => {
                throw new Error("Can't send email");
            });
            await expect(
                mailService.sendInvitationEmail(invitationDto, code),
            ).rejects.toThrow(new Error("Can't send email"));
        });
    });

    describe('sendNotificationPeople', () => {
        const emails = ['user1@site.com', 'user2@site.com', 'user3@site.com'];
        const typeId = 'typeId';
        const type = InvitationType.CANVAS;
        const message = "You're invited to our project";
        const name = 'orgName';

        it('sendNotificationPeople success', async () => {
            client.sendMultiple.mockResolvedValue({ success: true } as any);

            await expect(
                mailService.sendNotificationPeople(
                    emails,
                    typeId,
                    type,
                    message,
                    name,
                ),
            ).resolves.toEqual({ success: true });

            expect(client.sendMultiple).toBeCalledWith({
                to: emails,
                from: configValues.EMAIL_FROM,
                templateId: Templates.INVITATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    url: `${configValues.CLIENT_URL}/canvas/${typeId}/${type}`,
                    organization: message,
                },
            });
        });

        it('sendNotificationPeople error', async () => {
            client.sendMultiple.mockImplementationOnce(() => {
                throw new Error("Can't send email");
            });

            await expect(
                mailService.sendNotificationPeople(
                    emails,
                    typeId,
                    type,
                    message,
                    name,
                ),
            ).rejects.toThrow(new Error("Can't send email"));
        });
    });
});
