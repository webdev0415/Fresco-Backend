import {CacheModule, forwardRef, Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';

import {InvitationModule} from '../../modules/invitation/invitation.module';
import {MailModule} from '../mail/mail.module';
import {UserModule} from '../user/user.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {GoogleStrategy} from './google.strategy';
import {JwtStrategy} from './jwt.strategy';
import {BoardUserOrgModule} from "../board-user-org/board-user-org.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => BoardUserOrgModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        forwardRef(() => MailModule),
        forwardRef(() => InvitationModule),
        CacheModule.register({ ttl: 10000 }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}
