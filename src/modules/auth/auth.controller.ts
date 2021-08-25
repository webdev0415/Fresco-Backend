/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Body,
    CACHE_MANAGER,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Cache} from 'cache-manager';
import {v4} from 'uuid';

import {AuthUser} from '../../decorators/auth-user.decorator';
import {AuthGuard, AuthGuardGoogle} from '../../guards/auth.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {InvitationService} from '../../modules/invitation/invitation.service';
import {ConfigService} from '../../shared/services/config.service';
import {MailService} from '../mail/mail.service';
import {UserDto} from '../user/dto/UserDto';
import {UserEntity} from '../user/user.entity';
import {UserService} from '../user/user.service';
import {AuthService} from './auth.service';
import {CreateUserInvitationDto} from './dto/CreateUserInvitationDto';
import {LoginPayloadDto} from './dto/LoginPayloadDto';
import {TokenPayloadDto} from './dto/TokenPayloadDto';
import {UserLoginDto} from './dto/UserLoginDto';
import {UserRegisterDto} from './dto/UserRegisterDto';
import {ResendConfirmationEmail} from "./dto/ResendConfirmationEmail";
import {BoardUserOrgService} from "../board-user-org/board-user-org.service";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
        public readonly mailService: MailService,
        public readonly configService: ConfigService,
        public readonly invitationService: InvitationService,
        public readonly boardUserOrgService: BoardUserOrgService,
        @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
    ) {
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        if (!userEntity.verified) {
            throw new UnauthorizedException();
        }

        const token = await this.authService.createToken(userEntity);
        return new LoginPayloadDto(userEntity.toDto(), token);
    }

    @Post('createUser/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: CreateUserInvitationDto,
        description: 'create user with invitation',
    })
    async createUser(
        @Param('token') token: string,
        @Body() createUserInvitationDto: CreateUserInvitationDto,
    ): Promise<LoginPayloadDto> {
        const isValidToken = await this.invitationService.checkValidToken(
            token,
        );

        if (
            !isValidToken ||
            isValidToken.toEmail !== createUserInvitationDto.email
        ) {
            throw new NotFoundException();
        }

        const createdUser = await this.authService.createVerifyUser(
            createUserInvitationDto,
        );

        await this.invitationService.updateToVerified({
            token,
            id: isValidToken.id,
            orgId: isValidToken.orgId,
            permission: isValidToken.permission,
            userId: createdUser.id,
        });

        if (isValidToken.board) {
           let relation= await this.boardUserOrgService.AddCollaborator(isValidToken.board, isValidToken.orgId, createdUser.id, isValidToken.boardPermission)
        }

        const jwtToken = await this.authService.createToken(createdUser);
        return new LoginPayloadDto(createdUser.toDto(), jwtToken);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
        // @UploadedFile() file: IFile,
    ): Promise<UserDto> {
        const isExists = await this.userService.checkIfExists(
            userRegisterDto.email,
        );

        if (isExists) {


            throw new ConflictException();
        }

        const createdUser = await this.userService.createUser(
            userRegisterDto,
            // file,
        );

        const code = v4();
        await this._cacheManager.set(code, createdUser.id, {ttl: 3600});

        await this.mailService.sendConfirmationEmail(createdUser, code);
        return createdUser.toDto();
    }

    @Post('resendConfirmationEmail')
    @HttpCode(HttpStatus.OK)
    async resendConfirmationEmail(
        @Body() userRegisterDto: ResendConfirmationEmail,
        // @UploadedFile() file: IFile,
    ): Promise<UserDto> {
        console.log(userRegisterDto)
        const isExists = await this.authService.getUserByEmail(
            userRegisterDto.email,
        );
        console.log(isExists)
        if (!isExists) {
            throw new NotFoundException();
        }


        const code = v4();
        await this._cacheManager.set(code, isExists.id, {ttl: 3600});

        await this.mailService.sendConfirmationEmail(isExists, code);

        return isExists.toDto();
    }


    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({type: UserDto, description: 'current user info'})
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }

    @Get('confirm/:code')
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Param('code') code: string): Promise<UserDto> {
        const userId = await this._cacheManager.get(code);
        return this.userService.confirmEmail(userId);
    }

    @Get('google')
    @UseGuards(AuthGuardGoogle)
    googleAuth() {
        // do nothing.
    }

    @Get('google/callback')
    @UseGuards(AuthGuardGoogle)
    googleAuthRedirect(@Req() req, @Res() res) {
        const url = this.configService.get('CLIENT_URL');
        if (req.user) {
            const payload = req.user as TokenPayloadDto;
            return res.redirect(
                `${url}/auth/welcome-page?accessToken=${payload.accessToken}&expiresIn=${payload.expiresIn}`,
            );
        }
        return res.redirect(`${url}/auth/login`);
    }
}
