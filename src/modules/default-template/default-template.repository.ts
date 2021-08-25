import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { DefaultTemplateEntity } from './default-template.entity';

@EntityRepository(DefaultTemplateEntity)
export class DefaultTemplateRepository extends Repository<
    DefaultTemplateEntity
> {}
