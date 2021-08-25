import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CanvasModule } from '../canvas/canvas.module';
import { CanvasRepository } from '../canvas/canvas.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { InvitationTypeLinkUserController } from './invitation-type-link-user.controller';
import { InvitationTypeLinkUserRepository } from './invitation-type-link-user.repository';
import { InvitationTypeLinkUserService } from './invitation-type-link-user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvitationTypeLinkUserRepository,
            CanvasRepository,
            OrganizationRepository,
        ]),
        forwardRef(() => CanvasModule),
    ],
    controllers: [InvitationTypeLinkUserController],
    providers: [InvitationTypeLinkUserService],
    exports: [InvitationTypeLinkUserService],
})
export class InvitationTypeLinkUserModule {}
