import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { InvitationTypeLinkUserEntity } from './invitation-type-link-user.entity';

@EntityRepository(InvitationTypeLinkUserEntity)
export class InvitationTypeLinkUserRepository extends Repository<
    InvitationTypeLinkUserEntity
> {}
