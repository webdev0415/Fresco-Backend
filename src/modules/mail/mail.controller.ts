'use strict';

import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {MailService} from './mail.service';

@Controller('mail')
@ApiTags('mail')
export class MailController {
    constructor(private _mailService: MailService) {}
}
