import {Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { BoardDto } from './dto/BoardDto';
import {CanvasUserOrgEntity} from "../canvas-user-org/canvas-user-org.entity";
import {BoardUserOrgEntity} from "../board-user-org/board-user-org.entity";
import {InvitationTypeLinkEntity} from "../invitation-type-link/invitation-type-link.entity";

@Entity({ name: 'board' })
export class BoardEntity extends AbstractEntity<BoardDto> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({ name: 'createdUserId' })
    createdUserId: string;

    @Column({ name: 'categoryId' })
    categoryId: string;

    @Column({ name: 'imageId' })
    imageId: string;

    @Column({})
    data: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP' 
    })
    updatedAt: Date;

    @OneToMany(
        () => BoardUserOrgEntity,
        (boardUserOrgEntity) => boardUserOrgEntity.board,
    )
    boards?: BoardUserOrgEntity[];

    @OneToMany(
        () => InvitationTypeLinkEntity,
        (invitationTypeLinkEntity) => invitationTypeLinkEntity.board,
    )
    invitationBoardLinks?: InvitationTypeLinkEntity[];

    dtoClass = BoardDto;
}
