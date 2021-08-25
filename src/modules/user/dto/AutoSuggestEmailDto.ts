'use strict';
import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class AutoSuggestEmailDto {
    @IsString()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    orgId: string;
}
