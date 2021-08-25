/* eslint-disable @typescript-eslint/no-unused-vars */
// import { UserToOrgEntity } from '../user-org/user-org.entity';
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { InvitationType } from '../../common/constants/invitation-type';
import { PermissionEnum } from '../../common/constants/permission';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';
import {CanvasEntity} from "../canvas/canvas.entity";
import {BoardEntity} from "../board/board.entity";
import {OrganizationEntity} from "../organization/organization.entity";

@Entity({ name: 'invitation_type_link' })
export class InvitationTypeLinkEntity extends AbstractEntity<
    InvitationTypeLinkDto
> {
    @Column({ nullable: false, name: 'orgId' })
    orgId: string;

    @Column({ name: 'createdUserId' })
    createdUserId: string;

    @Column({ name: 'numberOfUser' })
    numberOfUser: number;

    @Column({ name: 'typeId' })
    typeId: string;

    @Column({ name: 'isDeleted' })
    isDeleted: boolean;

    @Column({})
    token: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;

    @Column({
        type: 'enum',
        enum: InvitationType,
    })
    public type: InvitationType;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @ManyToOne(() => CanvasEntity, (canvasEntity) => canvasEntity.invitationCanvasLinks)
    @JoinColumn({ name: 'typeId' })
    public canvas!: CanvasEntity;

    @ManyToOne(() => BoardEntity, (boardEntity) => boardEntity.invitationBoardLinks)
    @JoinColumn({ name: 'typeId' })
    public board!: BoardEntity;

    @ManyToOne(() => OrganizationEntity, (organizationEntity) => organizationEntity.invitationTypeLinks)
    @JoinColumn({ name: 'orgId' })
    public organization: OrganizationEntity;

    dtoClass = InvitationTypeLinkDto;
}
