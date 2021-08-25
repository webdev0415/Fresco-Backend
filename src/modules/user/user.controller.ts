'use strict';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../decorators/auth-user.decorator';

import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {AutoSuggestEmailDto} from './dto/AutoSuggestEmailDto';
import {UserDto} from './dto/UserDto';
import { UserEntity } from './user.entity';
import {UserService} from './user.service';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UserController {
    constructor(public readonly userService: UserService) {}

    @Post('suggest')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: AutoSuggestEmailDto,
        description: 'suggest email',
    })
    async suggestEmail(
        @Body() autoSuggestEmailDto: AutoSuggestEmailDto,
    ): Promise<UserDto[]> {
        const emails = await this.userService.suggestEmail(
            autoSuggestEmailDto.email,
            autoSuggestEmailDto.orgId,
        );
        return emails;
    }

    @Get('search')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: AutoSuggestEmailDto,
        description: 'search user email',
    })
    async searchUserWithEmail(@Query() query, @AuthUser() user: UserEntity): Promise<UserDto[]> {
        const emails = await this.userService.searchUserByKeyWord(
            query.keyword,
            user.id
        );
        return emails;
    }

    @Put('me')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'update user',
    })
    async updateUser(
        @AuthUser() user: UserEntity,
        @Body() userData: any,
    ): Promise<any> {

        return this.userService.updateUser(user.id, userData);
    }
}
