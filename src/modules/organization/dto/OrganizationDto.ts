'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { OrganizationEntity } from '../organization.entity';

export class OrganizationDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    // @ApiPropertyOptional()
    // planId: string;

    // @ApiPropertyOptional()
    // userId: string;

    constructor(organization: OrganizationEntity) {
        super(organization);
        this.name = organization.name;
        // this.planId = organization.planId;
        // this.userId = organization.userId;
    }
}
