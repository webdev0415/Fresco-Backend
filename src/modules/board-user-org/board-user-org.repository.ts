import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { BoardUserOrgEntity } from './board-user-org.entity';

@EntityRepository(BoardUserOrgEntity)
export class BoardUserOrgRepository extends Repository<BoardUserOrgEntity> {}
