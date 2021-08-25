import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { DefaultTemplateDto } from './dto/DefaultTemplateDto';

@Entity({ name: 'default_template' })
export class DefaultTemplateEntity extends AbstractEntity<DefaultTemplateDto> {


    @Column({})
    name: string;

    @Column({})
    data: string;

    @Column({ name: 'categoryId' })
    categoryId: string;

    @Column({ name: 'imageId' })
    imageId: string;

    dtoClass = DefaultTemplateDto;
}
