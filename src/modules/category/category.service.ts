import {Injectable, NotFoundException} from '@nestjs/common';

import {UploadImageRepository} from '../../modules/upload/upload-image.repository';
import {UploadImageService} from '../../modules/upload/upload-image.service';
import {UserToOrgRepository} from '../user-org/user-org.repository';
import {CategoryEntity} from './category.entity';
import {CategoryRepository} from './category.repository';
import {CategoryInfoDto} from './dto/CategoryInfoDto';
import {CreateCategoryDto} from './dto/CreateCategoryDto';
import {DeleteCategoryDto} from './dto/DeleteCategoryDto';
import {UpdateCategoryDto} from './dto/UpdateCategoryDto';

@Injectable()
export class CategoryService {
    constructor(
        public readonly categoryRepository: CategoryRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly uploadImageService: UploadImageService,
    ) {}

    async getById(id: string): Promise<CategoryInfoDto> {
        const category = await this.categoryRepository.findOne({
            where: {
                id,
            },
        });

        if (!category) {
            throw new NotFoundException();
        }

        const image = await this.uploadImageRepository.findOne({
            where: {
                id: category.imageId,
            },
        });

        const categoryDto = category.toDto() as CategoryInfoDto;
        categoryDto.path = image?.path || '';
        return categoryDto;
    }

    async getAll(): Promise<CategoryEntity[]> {
        const listCategoriesInfo = [];
        const categories = await this.categoryRepository.find();

        for (const category of categories) {
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: category.imageId,
                },
            });

            const categoryDto = category.toDto() as CategoryInfoDto;
            categoryDto.path = image?.path || '';
            listCategoriesInfo.push(categoryDto);
        }
        return listCategoriesInfo;
    }

    async create(
        createCategoryDto: CreateCategoryDto,
    ): Promise<CreateCategoryDto> {
        const categoryModel = new CategoryEntity();
        categoryModel.name = createCategoryDto.name;
        categoryModel.imageId = createCategoryDto.imageId;

        const image = await this.uploadImageService.getImageById(
            createCategoryDto.imageId,
        );

        const category = await this.categoryRepository.save(categoryModel);

        const categoryCreatedDto = category.toDto() as CreateCategoryDto;
        categoryCreatedDto.path = image?.path || '';
        categoryCreatedDto.imageId = createCategoryDto.imageId || '';

        return categoryCreatedDto;
    }

    async update(
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<UpdateCategoryDto> {
        const category = await this.categoryRepository.findOne(
            updateCategoryDto.id,
        );
        if (!category) {
            throw new NotFoundException();
        }
        category.name = updateCategoryDto.name || category.name;
        category.imageId = updateCategoryDto.imageId || category.imageId;

        const image = await this.uploadImageService.getImageById(
            category.imageId,
        );

        const categoryUpdated = await this.categoryRepository.save(category);

        const categoryUpdatedDto = categoryUpdated.toDto() as UpdateCategoryDto;
        categoryUpdatedDto.path = image?.path || '';

        return categoryUpdatedDto;
    }

    async delete({ categoryId }: DeleteCategoryDto): Promise<void> {
        await this.categoryRepository.delete(categoryId);
    }
}
