'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PermissionEnum } from '../../../common/constants/permission';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { BoardUserOrgEntity } from '../board-user-org.entity';

export class BoardUserOrgDto extends AbstractDto {
    @ApiPropertyOptional()
    boardId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    userId: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    constructor(boardUserOrgEntity: BoardUserOrgEntity) {
        super(boardUserOrgEntity);
        this.boardId = boardUserOrgEntity.boardId;
        this.orgId = boardUserOrgEntity.orgId;
        this.userId = boardUserOrgEntity.userId;
        this.permission = boardUserOrgEntity.permission;
    }
}
