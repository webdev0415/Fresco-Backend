import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { BoardRepository } from '../../modules/board/board.repository';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';
import { CanvasModule } from '../../modules/canvas/canvas.module';
import { InvitationTypeLinkUserModule } from '../../modules/invitation-type-link-user/invitation-type-link-user.module';
import { OrganizationRepository } from '../../modules/organization/organization.repository';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { CanvasRepository } from '../canvas/canvas.repository';
import { UserRepository } from '../user/user.repository';
import { InvitationTypeLinkController } from './invitation-type-link.controller';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';
import { InvitationTypeLinkService } from './invitation-type-link.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvitationTypeLinkRepository,
            CanvasRepository,
            OrganizationRepository,
            BoardRepository,
            BoardUserOrgRepository,
            CanvasUserOrgRepository,
            UserRepository,
            UserToOrgRepository,
        ]),
        forwardRef(() => CanvasModule),
        forwardRef(() => InvitationTypeLinkUserModule),
    ],
    controllers: [InvitationTypeLinkController],
    providers: [InvitationTypeLinkService],
    exports: [InvitationTypeLinkService],
})
export class InvitationTypeLinkModule {}
