'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CanvasUserOrgEntity } from '../canvas-user-org.entity';

export class CanvasUserOrgDto extends AbstractDto {
    @ApiPropertyOptional()
    canvasId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    userId: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    constructor(canvasUserOrgEntity: CanvasUserOrgEntity) {
        super(canvasUserOrgEntity);
        this.canvasId = canvasUserOrgEntity.canvasId;
        this.orgId = canvasUserOrgEntity.orgId;
        this.userId = canvasUserOrgEntity.userId;
        this.permission = canvasUserOrgEntity.permission;
    }
}
