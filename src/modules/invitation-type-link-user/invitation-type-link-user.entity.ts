/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserToOrgEntity } from '../user-org/user-org.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { InvitationTypeLinkUserDto } from './dto/InvitationTypeLinkUserDto';

@Entity({ name: 'invitation_type_link_user' })
export class InvitationTypeLinkUserEntity extends AbstractEntity<
    InvitationTypeLinkUserDto
> {
    @Column({ nullable: false, name: 'invitationTypeLinkId' })
    invitationTypeLinkId: string;

    @Column({ name: 'userId' })
    userId: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    dtoClass = InvitationTypeLinkUserDto;
}
