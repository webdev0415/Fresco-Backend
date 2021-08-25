import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { LoginPayloadDto } from '../../modules/auth/dto/LoginPayloadDto';
import { UserEntity } from '../../modules/user/user.entity';
import { InvitationDto } from './dto/InvitationDto';
import { InVitationTypeEmailDto } from './dto/InvitationTypeEmailDto';
import { SendInvitationDto } from './dto/SendInvitationDto';
import { VerifyTokenDto } from './dto/VerifyTokenDto';
import { InvitationService } from './invitation.service';

@Controller('invitation')
@ApiTags('invitation')
export class InvitationController {
    constructor(public readonly invitationService: InvitationService) {}

    @Post('')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({
        type: SendInvitationDto,
        description: 'create invitation',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() sendInvitationDto: SendInvitationDto,
    ): Promise<SendInvitationDto> {
        const invitation = await this.invitationService.create(
            user.id,
            sendInvitationDto,
        );
        return invitation.toDto();
    }

    @Put(':id/resend')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({
        type: InvitationDto,
        description: 'resend invitation',
    })
    async resendInvitation(
        @Param('id') token: string,
        @Body() invitationDto: InvitationDto,
    ): Promise<InvitationDto> {
        return this.invitationService.resendInvitation(token);
    }

    @Get('check/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: InvitationDto,
        description: 'Check token',
    })
    async checkValidToken(
        @Param('token') token: string,
    ): Promise<InvitationDto> {
        const invitation = await this.invitationService.checkValidToken(token);
        return invitation.toDto();
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'verify token',
    })
    async verifyToken(
        @Body() verifyTokenDto: VerifyTokenDto,
    ): Promise<LoginPayloadDto> {
        return this.invitationService.verify(verifyTokenDto);
    }

    @Post('type-email')
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'invitation type email',
    })
    async invitationEmail(
      @AuthUser() user: UserEntity,
      @Body() listInVitationTypeEmailDto: InVitationTypeEmailDto,
    ): Promise<void> {
        return this.invitationService.invitationTypeEmails(user, listInVitationTypeEmailDto);
    }
}
