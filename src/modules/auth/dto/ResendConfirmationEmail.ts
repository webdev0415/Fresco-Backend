'use strict';

import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Column} from "typeorm";

export class ResendConfirmationEmail {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @Column()
    email: string;


}
