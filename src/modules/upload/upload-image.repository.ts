import {Repository} from 'typeorm';
import {EntityRepository} from 'typeorm/decorator/EntityRepository';

import {UploadImageEntity} from './upload-image.entity';

@EntityRepository(UploadImageEntity)
export class UploadImageRepository extends Repository<UploadImageEntity> {}
