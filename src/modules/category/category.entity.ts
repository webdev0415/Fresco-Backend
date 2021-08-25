import {Column, CreateDateColumn, Entity, UpdateDateColumn} from 'typeorm';

import {AbstractEntity} from '../../common/abstract.entity';
import {CategoryDto} from './dto/CategoryDto';

@Entity({ name: 'category' })
export class CategoryEntity extends AbstractEntity<CategoryDto> {
    @Column({})
    name: string;

    @Column({ name: 'imageId' })
    imageId: string;

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

    dtoClass = CategoryDto;
}
