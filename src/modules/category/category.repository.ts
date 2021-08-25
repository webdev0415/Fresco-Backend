import {Repository} from 'typeorm';
import {EntityRepository} from 'typeorm/decorator/EntityRepository';

import {CategoryEntity} from './category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}
