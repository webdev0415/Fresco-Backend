/* eslint-disable complexity */
import { Injectable, NotFoundException } from '@nestjs/common';

import { CategoryRepository } from '../../modules/category/category.repository';
import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
import { UploadImageService } from '../../modules/upload/upload-image.service';
import { DefaultTemplateEntity } from './default-template.entity';
import { DefaultTemplateRepository } from './default-template.repository';
import { CreateDefaultTemplateDto } from './dto/CreateDefaultTemplateDto';
import { DefaultTemplateInfoDto } from './dto/DefaultTemplateInfoDto';
import { DeleteDefaultTemplateDto } from './dto/DeleteDefaultTemplateDto';
import { UpdateDefaultTemplateDto } from './dto/UpdateDefaultTemplateDto';

@Injectable()
export class DefaultTemplateService {
    constructor(
        public readonly defaultTemplateRepository: DefaultTemplateRepository,
        public readonly categoryRepository: CategoryRepository,
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly uploadImageService: UploadImageService,
    ) {}

    async get(): Promise<DefaultTemplateInfoDto[]> {
        const listDefaultInfo = [];
        const defaultTemplates = await this.defaultTemplateRepository.find();
        for (const defaultTemplate of defaultTemplates) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: defaultTemplate.categoryId,
                },
            });
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: defaultTemplate.imageId,
                },
            });
            const defaultTemplateDto = defaultTemplate.toDto() as DefaultTemplateInfoDto;
            defaultTemplateDto.category = category?.toDto() || null;
            defaultTemplateDto.path = image?.path || '';
            listDefaultInfo.push(defaultTemplateDto);
        }
        return listDefaultInfo;
    }

    async create(
        defaultTemplateDto: CreateDefaultTemplateDto,
    ): Promise<CreateDefaultTemplateDto> {
        const defaultTemplateModel = new DefaultTemplateEntity();
        defaultTemplateModel.name = defaultTemplateDto.name;
        defaultTemplateModel.data = defaultTemplateDto.data;
        defaultTemplateModel.categoryId = defaultTemplateDto.categoryId;
        defaultTemplateModel.imageId = defaultTemplateDto.imageId;

        const image = await this.uploadImageService.getImageById(
            defaultTemplateDto.imageId,
        );

        const defaultTemplateCreated = await this.defaultTemplateRepository.save(
            defaultTemplateModel,
        );

        const defaultTemplateCreatedDto = defaultTemplateCreated.toDto() as CreateDefaultTemplateDto;
        defaultTemplateCreatedDto.path = image?.path || '';
        defaultTemplateCreatedDto.categoryId =
            defaultTemplateDto.categoryId || '';
        defaultTemplateCreatedDto.imageId = defaultTemplateDto.imageId || '';

        return defaultTemplateCreatedDto;
    }

    async update(
        defaultTemplateDto: UpdateDefaultTemplateDto,
    ): Promise<UpdateDefaultTemplateDto> {
        const defaultTemplate = await this.defaultTemplateRepository.findOne(
            defaultTemplateDto.id,
        );
        if (!defaultTemplate) {
            throw new NotFoundException();
        }
        defaultTemplate.name = defaultTemplateDto.name || defaultTemplate.name;
        defaultTemplate.data = defaultTemplateDto.data || defaultTemplate.data;
        defaultTemplate.categoryId = defaultTemplateDto.categoryId || defaultTemplate.categoryId;
        defaultTemplate.imageId = defaultTemplateDto.imageId || defaultTemplate.imageId;

        const image = await this.uploadImageService.getImageById(
            defaultTemplate.imageId,
        );

        const defaultTemplateUpdated = await this.defaultTemplateRepository.save(
            defaultTemplate,
        );

        const defaultTemplateUpdatedDto = defaultTemplateUpdated.toDto() as UpdateDefaultTemplateDto;
        defaultTemplateUpdatedDto.path = image?.path || '';

        return defaultTemplateUpdatedDto;
    }

    async delete({
        defaultTemplateId,
    }: DeleteDefaultTemplateDto): Promise<void> {
        await this.defaultTemplateRepository.delete(defaultTemplateId);
    }
}
