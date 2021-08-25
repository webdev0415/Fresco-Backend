/* eslint-disable @typescript-eslint/tslint/config */
import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {UserNotFoundException} from '../../exceptions/user-not-found.exception';
import {UserVerifyDto} from '../../modules/invitation/dto/UserVerifyDto';
import {ContextService} from '../../providers/context.service';
import {UtilsService} from '../../providers/utils.service';
import {ConfigService} from '../../shared/services/config.service';
import {UserDto} from '../user/dto/UserDto';
import {UserEntity} from '../user/user.entity';
import {UserService} from '../user/user.service';
import {CreateUserInvitationDto} from './dto/CreateUserInvitationDto';
import {TokenPayloadDto} from './dto/TokenPayloadDto';
import {UserLoginDto} from './dto/UserLoginDto';
import {UserLoginGoogleDto} from './dto/UserLoginGoogleDto';

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';

    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
    ) {}

    async createToken(
        user: UserEntity | UserDto | UserVerifyDto,
    ): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ id: user.id }),
        });
    }

    // eslint-disable-next-line complexity
    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.getUserByEmail(userLoginDto.email);
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );
        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }
        return user;
    }

     async getUserByEmail(email: string) {
        return await this.userService.findOne({
            email: email,
        });
    }

    static setAuthUser(user: UserEntity) {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }

    // eslint-disable-next-line complexity
    async validateOAuthLoginEmail(
        email: string,
        userGoogle: UserLoginGoogleDto,
    ): Promise<TokenPayloadDto> {
        let user = await this.userService.findByUsernameOrEmail({ email });

        if (!user) {
            user = await this.userService.createUserForGoogle(userGoogle);
        }

        if (!user.googleId) {
            user.googleId = userGoogle.googleId;
            user.verified = true;
            await this.userService.update(user);
        }

        return this.createToken(user);
    }

    async createVerifyUser(
        createUserInvitationDto: CreateUserInvitationDto,
    ): Promise<UserEntity> {
        const createdUser = await this.userService.createUser({
            email: createUserInvitationDto.email,
            password: createUserInvitationDto.password,
            firstName: createUserInvitationDto.firstName,
            lastName: createUserInvitationDto.lastName,
            // name: createUserInvitationDto.name,
            verified: true,
        });

        return createdUser;
    }
}
