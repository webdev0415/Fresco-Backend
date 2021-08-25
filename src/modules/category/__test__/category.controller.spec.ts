/* eslint-disable @typescript-eslint/no-unused-vars */
import {Test} from '@nestjs/testing';

import {CategoryController} from "../category.controller";
import {CategoryService} from "../category.service";
import {CategoryEntity} from "../category.entity";
import {CreateCategoryDto} from "../dto/CreateCategoryDto";
import {UpdateCategoryDto} from "../dto/UpdateCategoryDto";
import {DeleteCategoryDto} from "../dto/DeleteCategoryDto";
import {mockCategoryService} from "../../__test__/base.service.specs";

let mockCategoryEntity:CategoryEntity=new CategoryEntity();

describe('CategoryController', () => {
    let categoryController: CategoryController;
    let categoryService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({

            providers: [
                CategoryController,
                { provide: CategoryService, useFactory: mockCategoryService },
            ],
        }).compile();

        categoryService = module.get<CategoryService>(CategoryService);
        categoryController = module.get<CategoryController>(CategoryController);

    });


    describe('get list category by category id',  () => {
        it('should return category entity', async() => {
            categoryService.getById.mockResolvedValue(mockCategoryEntity);
            let result=await categoryController.getById("id");
            expect(result).toEqual(mockCategoryEntity);
        });
    });

    describe('get list category ',  () => {
        it('should return category entity list', async() => {
            categoryService.getAll.mockResolvedValue([mockCategoryEntity]);
            let result=await categoryController.getAll();
            expect(result).toHaveLength(1)
        });
    });

    describe('create category',  () => {
        it('should return createcategoryDto', async() => {
            let createcategoryDto:CreateCategoryDto=new  CreateCategoryDto();

            categoryService.create.mockResolvedValue(createcategoryDto);
            let result=await categoryController.create(createcategoryDto);
            expect(result).toEqual(createcategoryDto)
        });
    });
    describe('update category',  () => {
        it('should return categoryDto', async() => {
            let createcategoryDto:UpdateCategoryDto=new  UpdateCategoryDto();

            categoryService.update.mockResolvedValue(mockCategoryEntity);
            let result=await categoryController.update("",createcategoryDto);
            expect(result).toEqual(mockCategoryEntity)
        });
    });
    describe('delete category',  () => {
        it('should return void', async() => {

            categoryService.delete.mockResolvedValue(mockCategoryEntity);
            let result=await categoryController.delete("",new DeleteCategoryDto());
            expect(result).toBeFalsy()

        });
    });


});
