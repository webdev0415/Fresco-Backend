import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {PermissionEnum} from '../../common/constants/permission';
import {OrganizationEntity} from '../organization/organization.entity';
import {UserEntity} from '../user/user.entity';
import {UserToOrgDto} from './dto/user-orgDto';

@Entity({ name: 'user_org' })
export class UserToOrgEntity extends AbstractEntity<UserToOrgDto> {
    @Column({ nullable: true })
    id: string;

    @Column({
        type: 'enum',
        enum: PermissionEnum,
        default: PermissionEnum.VIEW,
    })
    public permission: PermissionEnum;

    @Column({ nullable: false, name: 'userId' })
    userId: string;

    @Column({ nullable: false, name: 'orgId' })
    orgId: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.orgs)
    @JoinColumn({ name: 'userId' })
    public user!: UserEntity;

    @ManyToOne(
        () => OrganizationEntity,
        (organizationEntity) => organizationEntity.users,
    )
    @JoinColumn({ name: 'orgId' })
    public organization!: OrganizationEntity;

    // @Column({ nullable: true })
    // avatar: string;

    dtoClass = UserToOrgDto;
}
