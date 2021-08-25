import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardGateway } from '../../gateway/board/board.gateway';
import { BoardUserOrgRepository } from '../board-user-org/board-user-org.repository';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MessageRepository,
            BoardUserOrgRepository,
            UserToOrgRepository,
            UserRepository,
        ]),
    ],
    controllers: [MessageController],
    providers: [MessageService, BoardGateway, UserService],
    exports: [MessageService, BoardGateway, UserService],
})
export class MessageModule {}
