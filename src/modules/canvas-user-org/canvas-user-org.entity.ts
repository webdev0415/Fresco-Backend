import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PermissionEnum } from '../../common/constants/permission';
import { CanvasEntity } from '../../modules/canvas/canvas.entity';
import { OrganizationEntity } from '../../modules/organization/organization.entity';
import { UserEntity } from '../../modules/user/user.entity';
import { CanvasUserOrgDto } from './dto/CanvasUserOrgDto';

@Entity({ name: 'canvas_user_org' })
export class CanvasUserOrgEntity extends AbstractEntity<CanvasUserOrgDto> {
    @Column({ name: 'canvasId' })
    canvasId: string;

    @Column({ name: 'orgId' })
    orgId: string;

    @Column({nullable:true,  name: 'userId' })
    userId: string;



    @Column({
        type: 'enum',
        enum: PermissionEnum,
    })
    public permission: PermissionEnum;

    @ManyToOne(() => CanvasEntity, (canvasEntity) => canvasEntity.canvases)
    @JoinColumn({ name: 'canvasId' })
    public canvas!: CanvasEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.canvases)
    @JoinColumn({ name: 'userId' })
    public user!: UserEntity;

    @ManyToOne(
        () => OrganizationEntity,
        (organizationEntity) => organizationEntity.canvases,
    )
    @JoinColumn({ name: 'orgId' })
    public organization!: OrganizationEntity;

    dtoClass = CanvasUserOrgDto;
}
