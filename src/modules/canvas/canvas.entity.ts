import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { CanvasDto } from './dto/CanvasDto';
import {InvitationTypeLinkEntity} from "../invitation-type-link/invitation-type-link.entity";

@Entity({ name: 'canvas' })
export class CanvasEntity extends AbstractEntity<CanvasDto> {
    @Column({})
    name: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({ name: 'createdUserId' })
    createdUserId: string;

    @Column({})
    data: string;

    @Column({ name: 'imageId' })
    imageId: string;

    @Column({ name: 'categoryId' })
    categoryId: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @OneToMany(
        () => CanvasUserOrgEntity,
        (canvasUserOrgEntity) => canvasUserOrgEntity.canvas,
    )
    canvases?: CanvasUserOrgEntity[];

    @OneToMany(
        () => InvitationTypeLinkEntity,
        (invitationTypeLinkEntity) => invitationTypeLinkEntity.canvas,
    )
    invitationCanvasLinks?: InvitationTypeLinkEntity[];

    dtoClass = CanvasDto;
}
