'use strict';

import {ApiPropertyOptional} from '@nestjs/swagger';

import {RoleType} from '../../../common/constants/role-type';
import {AbstractDto} from '../../../common/dto/AbstractDto';
import {UserEntity} from '../user.entity';

export class UserDto extends AbstractDto {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    firstName: string;

    @ApiPropertyOptional()
    lastName: string;

    @ApiPropertyOptional()
    about: string;

    @ApiPropertyOptional()
    avatar: string;

    constructor(user: UserEntity) {
        super(user);
        this.name = user.name;
        this.role = user.role;
        this.email = user.email;
        this.firstName = user.email;
        this.lastName = user.email;
        this.avatar = user.avatar;
        this.about = user.about;
    }
}
