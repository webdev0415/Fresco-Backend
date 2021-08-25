'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {PermissionEnum} from '../../../common/constants/permission';
import {AbstractDto} from '../../../common/dto/AbstractDto';
import {UserToOrgEntity} from '../user-org.entity';

export class UserToOrgDto extends AbstractDto {
    @ApiPropertyOptional()
    userId: string;

    @ApiPropertyOptional()
    orgId: string;

    @ApiPropertyOptional()
    permission: PermissionEnum;

    @ApiPropertyOptional()
    organizationName: string;

    @ApiPropertyOptional()
    fName: string;

    @ApiPropertyOptional()
    lName: string;

    constructor(userToOrg: UserToOrgEntity) {
        super(userToOrg);
        this.userId = userToOrg.userId;
        this.orgId = userToOrg.orgId;
        this.permission = userToOrg.permission;
        this.organizationName = userToOrg.organization.name;
        this.fName = userToOrg.organization.fName;
        this.lName = userToOrg.organization.lName;
    }
}
