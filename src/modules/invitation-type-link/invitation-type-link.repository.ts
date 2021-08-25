import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { InvitationTypeLinkEntity } from './invitation-type-link.entity';

@EntityRepository(InvitationTypeLinkEntity)
export class InvitationTypeLinkRepository extends Repository<
    InvitationTypeLinkEntity
> {}
