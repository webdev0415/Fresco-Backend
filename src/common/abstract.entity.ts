'use strict';

import {PrimaryGeneratedColumn,} from 'typeorm';

import {UtilsService} from '../providers/utils.service';
import {AbstractDto} from './dto/AbstractDto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @CreateDateColumn({
    //     type: 'timestamp',
    //     name: 'createdAt',
    // })
    // createdAt: Date;

    // @UpdateDateColumn({
    //     type: 'timestamp',
    //     name: 'updatedAt',
    // })
    // updatedAt: Date;

    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: any) {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}
