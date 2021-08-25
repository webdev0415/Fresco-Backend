'use strict';

import { ConflictException } from '@nestjs/common';

export class InvitationAcceptedException extends ConflictException {
    constructor(error?: string) {
        if (error) {
            super(error);
        } else {
            super('error.Invitation_accepted');
        }
    }
}
