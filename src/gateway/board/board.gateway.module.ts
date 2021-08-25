import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { UserModule } from '../../modules/user/user.module';
import { UserRepository } from '../../modules/user/user.repository';
import { UserService } from '../../modules/user/user.service';
import { ConfigService } from '../../shared/services/config.service';
import { BoardGateway } from './board.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository, UserToOrgRepository]),
        forwardRef(() => UserModule),
    ],
    providers: [BoardGateway, UserService, ConfigService],
    exports: [UserService, ConfigService],
})
export class BoardGatewayModule {}
