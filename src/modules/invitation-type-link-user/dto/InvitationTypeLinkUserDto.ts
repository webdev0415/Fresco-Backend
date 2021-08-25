'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { InvitationTypeLinkUserEntity } from '../invitation-type-link-user.entity';

export class InvitationTypeLinkUserDto extends AbstractDto {
    @ApiPropertyOptional()
    invitationTypeLinkId: string;

    @ApiPropertyOptional()
    userId: string;

    constructor(invitation: InvitationTypeLinkUserEntity) {
        super(invitation);
        this.userId = invitation.userId;
        this.invitationTypeLinkId = invitation.invitationTypeLinkId;
    }
}
