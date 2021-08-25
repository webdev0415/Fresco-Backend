/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserToOrgEntity } from '../user-org/user-org.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PermissionEnum } from '../../common/constants/permission';
import { OrganizationEntity } from '../../modules/organization/organization.entity';
import { UserEntity } from '../../modules/user/user.entity';
import { InvitationDto } from './dto/InvitationDto';

@Entity({ name: 'invitation' })
export class InvitationEntity extends AbstractEntity<InvitationDto> {
    @Column({ nullable: false, name: 'orgId' })
    orgId: string;

    @Column({ nullable: false, name: 'fromUserId' })
    fromUserId: string;

    @Column({ nullable: true, name: 'board' })
    board?: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,name:"boardPermission"
    })
    boardPermission: PermissionEnum;

    @Column({ name: 'toUserId' })
    toUserId: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ name: 'toEmail' })
    toEmail: string;

    @Column({})
    token: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;

    @OneToOne((user) => UserEntity)
    @JoinColumn({ name: 'fromUserId',referencedColumnName:"email" })
    fromUser?: UserEntity;

    @OneToOne((user) => UserEntity)
    @JoinColumn({ name: 'toUserId' })
    userInvite?: UserEntity;

    @OneToOne((organization) => OrganizationEntity)
    @JoinColumn({ name: 'orgId' })
    organization?: OrganizationEntity;

    // @OneToMany(
    //     (type) => UserToOrgEntity,
    //     (userToOrgEntity) => userToOrgEntity.user,
    // )
    // orgs?: UserToOrgEntity[];

    dtoClass = InvitationDto;
}
