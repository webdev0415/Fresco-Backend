'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { InvitationTypeLinkEntity } from '../invitation-type-link.entity';

export class InvitationTypeLinkDto extends AbstractDto {
    @ApiPropertyOptional()
    createdUserId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    numberOfUser: number;

    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    @ApiPropertyOptional()
    type: InvitationType;

    @ApiPropertyOptional()
    typeId: string;

    isDeleted: boolean;

    constructor(invitation: InvitationTypeLinkEntity) {
        super(invitation);
        this.token = invitation.token;
        this.createdUserId = invitation.createdUserId;
        this.orgId = invitation.orgId;
        this.numberOfUser = invitation.numberOfUser;
        this.type = invitation.type;
        this.permission = invitation.permission;
        this.typeId = invitation.typeId;
        this.isDeleted = invitation.isDeleted;
    }
}
