'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import {OrganizationEntity} from "../../organization/organization.entity";
import {UserEntity} from "../../user/user.entity";
import {InvitationEntity} from "../../invitation/invitation.entity";
import {InvitationTypeLinkEntity} from "../invitation-type-link.entity";
import {BoardEntity} from "../../board/board.entity";
import {BoardDto} from "../../board/dto/BoardDto";
import {BoardInfoDto} from "../../board/dto/BoardInfoDto";
import {CanvasEntity} from "../../canvas/canvas.entity";

export class InvitationTypeLinkInfoDto extends AbstractDto {
    @ApiPropertyOptional()
    token: string;

    @ApiPropertyOptional()
    orgId: string;

    createdUserId: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    @ApiPropertyOptional()
    numberOfUsers: number;

    @ApiPropertyOptional()
    type: InvitationType;

    @ApiPropertyOptional()
    typeId: string;

    organization: OrganizationEntity;
    board: BoardEntity;
    canvas: CanvasEntity;

    constructor(invitationTypeLinkEntity: InvitationTypeLinkEntity) {
        super(invitationTypeLinkEntity);

        this.orgId = invitationTypeLinkEntity.orgId;
        this.createdUserId = invitationTypeLinkEntity.createdUserId;
        this.numberOfUsers = invitationTypeLinkEntity.numberOfUser;
        this.type = invitationTypeLinkEntity.type;
        this.typeId = invitationTypeLinkEntity.typeId;
        this.token = invitationTypeLinkEntity.token;
        this.permission = invitationTypeLinkEntity.permission;
    }
}
