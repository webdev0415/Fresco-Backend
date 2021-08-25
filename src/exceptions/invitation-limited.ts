'use strict';

import { BadRequestException } from '@nestjs/common';

export class InvitationLimitedException extends BadRequestException {
    constructor(error?: string) {
        if (error) {
            super(error);
        } else {
            super('error.Invitation_limited');
        }
    }
}
