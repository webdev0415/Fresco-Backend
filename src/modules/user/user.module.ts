import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserToOrgRepository} from '../../modules/user-org/user-org.repository';

import {AuthModule} from '../auth/auth.module';
import {UserController} from './user.controller';
import {UserRepository} from './user.repository';
import {UserService} from './user.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([UserRepository, UserToOrgRepository]),
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
