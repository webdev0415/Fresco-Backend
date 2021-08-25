import {Repository} from 'typeorm';
import {EntityRepository} from 'typeorm/decorator/EntityRepository';

import {CanvasEntity} from './canvas.entity';

@EntityRepository(CanvasEntity)
export class CanvasRepository extends Repository<CanvasEntity> {}
