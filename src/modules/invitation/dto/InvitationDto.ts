'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { InvitationEntity } from '../invitation.entity';

export class InvitationDto extends AbstractDto {
    name?: string;

    organizationName?: string;

    @ApiPropertyOptional()
    toUserId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    toEmail: string;

    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    constructor(invitation: InvitationEntity) {
        super(invitation);
        // this.name = invitation.user?.name;
        this.orgId = invitation.orgId;
        this.toUserId = invitation.toUserId;
        // this.organizationName = invitation.organization?.name;
        this.toEmail = invitation.toEmail;
        this.token = invitation.token;
        this.permission = invitation.permission;
    }
}
