'use strict';

import { BadRequestException } from '@nestjs/common';

export class InvitationNotValidException extends BadRequestException {
    constructor(error?: string) {
        super('error.Invitation_not_Valid', error);
    }
}
