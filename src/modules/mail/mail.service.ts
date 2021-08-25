import { Injectable, Logger } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

import { Templates } from '../../common/constants/email-templates';
import { ConfigService } from '../../shared/services/config.service';
import { SendEmailInvitationDto } from '../invitation/dto/SendEmailInvitationDto';
import { UserDto } from '../user/dto/UserDto';

@Injectable()
export class MailService {
    private readonly _logger = new Logger(MailService.name);

    constructor(
        public readonly configService: ConfigService,
        @InjectSendGrid() private readonly _client: SendGridService,
    ) {}

    getEmailClient(): SendGridService {
        return this._client;
    }

    /** Send email confirmation link to new user account. */
    async sendConfirmationEmail(user: UserDto, code: string): Promise<any> {
        try {
            const clientUrl = this.configService.get('CLIENT_URL');
            const url = `${clientUrl}/auth/confirm/${code}`;
            return await this.getEmailClient().send({
                to: user.email,
                from: this.configService.get('EMAIL_FROM'),
                templateId: Templates.CONFIRMATION_TEMPLATE_ID,
                dynamicTemplateData: { url },
            });
        } catch (error) {
            this._logger.error(
                `Failed to send confirmation email to ${user.email}`,
                error.stack,
            );
            throw error;
        }
    }

    async sendInvitationEmail(
        organization: SendEmailInvitationDto,
        code: string,
    ): Promise<any> {
        try {
            const clientUrl = this.configService.get('CLIENT_URL');
            const url = `${clientUrl}/invitation/check/${code}`;
            return await this.getEmailClient().send({
                to: organization.email,
                from: this.configService.get('EMAIL_FROM'),
                templateId: Templates.INVITATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    url,
                    organization: organization.organizationName,
                },
            });
        } catch (error) {
            this._logger.error(
                `Failed to send invitation email to ${organization.email}`,
                error.stack,
            );
            throw error;
        }
    }

    async sendNotificationPeople(
        emails: string[],
        typeId: string,
        type: string,
        message: string,
        name: string,
    ): Promise<any> {
        try {
            const clientUrl = this.configService.get('CLIENT_URL');

            // TODO fix this url for specific type
            const url = `${clientUrl}/canvas/${typeId}/${type}`;
            return await this.getEmailClient().sendMultiple({
                to: emails,
                from: this.configService.get('EMAIL_FROM'),
                templateId: Templates.INVITATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    url,
                    organization: message,
                },
            });
        } catch (error) {
            this._logger.error(
                `Failed to send Notify email to ${emails}`,
                error.stack,
            );
            throw error;
        }
    }
}
