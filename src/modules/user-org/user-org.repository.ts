import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { UserToOrgEntity } from './user-org.entity';

@EntityRepository(UserToOrgEntity)
export class UserToOrgRepository extends Repository<UserToOrgEntity> {}
