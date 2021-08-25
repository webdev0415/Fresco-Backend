'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class HandleRequestInvitationLinkDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'token is required' })
    token: string;
}
