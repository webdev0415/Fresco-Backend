import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PermissionEnum } from '../../common/constants/permission';
import { BoardUserOrgDto } from './dto/BoardUserOrgDto';
import {CanvasEntity} from "../canvas/canvas.entity";
import {UserEntity} from "../user/user.entity";
import {OrganizationEntity} from "../organization/organization.entity";
import {BoardEntity} from "../board/board.entity";

@Entity({ name: 'board_user_org' })
export class BoardUserOrgEntity extends AbstractEntity<BoardUserOrgDto> {
    @Column({ name: 'boardId' })
    boardId: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({nullable:true,  name: 'userId' })
    userId: string;



    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;



    @ManyToOne(() => BoardEntity, (boardEntity) => boardEntity.boards)
    @JoinColumn({ name: 'boardId' })
    public board!: BoardEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.boards)
    @JoinColumn({ name: 'userId' })
    public user!: UserEntity;

    @ManyToOne(
        () => OrganizationEntity,
        (organizationEntity) => organizationEntity.boards,
    )
    @JoinColumn({ name: 'orgId' })
    public organization!: OrganizationEntity;

    dtoClass = BoardUserOrgDto;
}
