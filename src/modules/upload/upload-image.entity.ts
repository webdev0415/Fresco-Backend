import {Column, CreateDateColumn, Entity, UpdateDateColumn} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {UploadImageDto} from './dto/UploadImageDto';

@Entity({ name: 'image' })
export class UploadImageEntity extends AbstractEntity<UploadImageDto> {
    @Column({})
    type: string;

    @Column({})
    path: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'createdAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    dtoClass = UploadImageDto;
}
