import { InvitationEntity } from '../invitation.entity';

export class SendEmailInvitationDto {
    organizationName: string;

    email: string;

    constructor(invitation: InvitationEntity) {
        this.organizationName = invitation.organization.name;
        this.email = invitation.toEmail;
        // this.avatar = user.avatar;
    }
}
