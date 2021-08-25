import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { InvitationEntity } from './invitation.entity';

@EntityRepository(InvitationEntity)
export class InvitationRepository extends Repository<InvitationEntity> {}
