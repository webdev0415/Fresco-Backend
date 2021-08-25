import {Repository} from 'typeorm';
import {EntityRepository} from 'typeorm/decorator/EntityRepository';

import {BoardEntity} from './board.entity';

@EntityRepository(BoardEntity)
export class BoardRepository extends Repository<BoardEntity> {}
