/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {CategoryService} from './category.service';
import {CategoryDto} from './dto/CategoryDto';
import {CategoryInfoDto} from './dto/CategoryInfoDto';
import {CreateCategoryDto} from './dto/CreateCategoryDto';
import {DeleteCategoryDto} from './dto/DeleteCategoryDto';
import {UpdateCategoryDto} from './dto/UpdateCategoryDto';

@Controller('category')
@ApiTags('category')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class CategoryController {
    constructor(public readonly categoryService: CategoryService) {}

    @Get(':id')
    @ApiOkResponse({
        type: CategoryDto,
        description: 'get detail category',
    })
    async getById(@Param('id') id: string): Promise<CategoryInfoDto> {
        const category = await this.categoryService.getById(id);
        return category;
    }

    @Get('')
    @ApiOkResponse({
        type: CategoryDto,
        description: 'get all category',
    })
    async getAll(): Promise<CategoryDto[]> {
        const categories = await this.categoryService.getAll();
        return categories;
    }

    @Post('')
    @ApiOkResponse({
        type: CategoryDto,
        description: 'create category',
    })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<CreateCategoryDto> {
        const category = await this.categoryService.create(createCategoryDto);
        return category;
    }

    @Put(':id')
    @ApiOkResponse({
        type: CategoryDto,
        description: 'update category',
    })
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryDto> {
        updateCategoryDto.id = id;
        const category = await this.categoryService.update(updateCategoryDto);
        return category;
    }

    @Delete(':id')
    @ApiOkResponse({
        type: CategoryDto,
        description: 'delete category',
    })
    async delete(
        @Param('id') id: string,
        @Body() deleteCategoryDto: DeleteCategoryDto,
    ): Promise<void> {
        deleteCategoryDto.categoryId = id;
        await this.categoryService.delete(deleteCategoryDto);
    }
}
