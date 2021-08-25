import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';

import { AuthModule } from '../../modules/auth/auth.module';
import { MailModule } from '../../modules/mail/mail.module';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { UserModule } from '../../modules/user/user.module';
import { InvitationController } from './invitation.controller';
import { InvitationRepository } from './invitation.repository';
import { InvitationService } from './invitation.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => MailModule),
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([InvitationRepository, UserToOrgRepository, BoardUserOrgRepository, CanvasUserOrgRepository]),
    ],
    controllers: [InvitationController],
    providers: [InvitationService],
    exports: [InvitationService],
})
export class InvitationModule {}
