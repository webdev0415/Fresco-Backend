'use strict';


import {OrganizationEntity} from "../../organization/organization.entity";
import {CanvasEntity} from "../../canvas/canvas.entity";
import {BoardEntity} from "../../board/board.entity";
import {PermissionEnum} from "../../../common/constants/permission";

export class GetInvitationTypeLinkByTypeAndOrgDto {
    id: string;
    token: string;
    orgId: string;
    createdUserId: string;
    permission: PermissionEnum;
    numberOfUser: number;
    type: string;
    typeId: string;
    isDeleted: boolean;
    organization: OrganizationEntity;
    boardOrCanvas: CanvasEntity | BoardEntity;
}