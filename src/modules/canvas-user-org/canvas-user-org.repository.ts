import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CanvasUserOrgEntity } from './canvas-user-org.entity';

@EntityRepository(CanvasUserOrgEntity)
export class CanvasUserOrgRepository extends Repository<CanvasUserOrgEntity> {}
