'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteInvitationTypeLinkDto {
    invitationTypeLinkId: string;

    createdUserId: string
}
