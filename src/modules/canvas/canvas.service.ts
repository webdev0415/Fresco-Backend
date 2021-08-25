/* eslint-disable complexity */
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';

import { PermissionEnum } from '../../common/constants/permission';
import { CategoryRepository } from '../../modules/category/category.repository';
import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
import { UploadImageService } from '../../modules/upload/upload-image.service';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { CanvasEntity } from './canvas.entity';
import { CanvasRepository } from './canvas.repository';
import { CanvasInfoDto } from './dto/CanvasInfoDto';
import { CreateCanvasDto } from './dto/CreateCanvasDto';
import { DeleteCanvasDto } from './dto/DeleteCanvasDto';
import { UpdateCanvasDto } from './dto/UpdateCanvasDto';
import { UserRepository } from '../../modules/user/user.repository';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';

@Injectable()
export class CanvasService {
    constructor(
        public readonly canvasRepository: CanvasRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly categoryRepository: CategoryRepository,
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly uploadImageService: UploadImageService,
        public readonly canvasUserOrgRepository: CanvasUserOrgRepository,
        public readonly userRepository: UserRepository,
    ) {}

    async isAdminOrEditor(userId: string, orgId: string) {
        const userToOrg = await this.userToOrgRepository
            .createQueryBuilder('userToOrg')
            .where('userToOrg.userId = :userId', { userId })
            .andWhere('userToOrg.orgId = :orgId', { orgId })
            .andWhere(
                'userToOrg.permission != :viewer',
                { viewer: PermissionEnum.VIEW },
            )
            .getOne();
        if (!userToOrg) {
            throw new UnauthorizedException();
        }
        return userToOrg;
    }

    async checkPermissionInBoard(
        userId: string,
        canvasId: string,
        orgId: string,
    ) {
        const canvasUserOrg = await this.canvasUserOrgRepository
            .createQueryBuilder('canvasUserOrg')
            .where('canvasUserOrg.userId = :userId', { userId })
            .andWhere('canvasUserOrg.orgId = :orgId', { orgId })
            .andWhere('canvasUserOrg.canvasId = :canvasId', { canvasId })
            .andWhere('canvasUserOrg.permission != :viewer', {
                viewer: PermissionEnum.VIEW,
            })
            .getOne();
        if (!canvasUserOrg) {
            throw new UnauthorizedException();
        }

        return canvasUserOrg;
    }

    async getById(id: string): Promise<CanvasInfoDto> {
        const canvas = await this.canvasRepository.findOne({
            where: {
                id,
            },
        });
        if (!canvas) {
            throw new NotFoundException();
        }
        const category = await this.categoryRepository.findOne({
            where: {
                id: canvas.categoryId,
            },
        });
        const image = await this.uploadImageRepository.findOne({
            where: {
                id: canvas.imageId,
            },
        });
        const canvasDto = canvas.toDto() as CanvasInfoDto;
        canvasDto.category = category?.toDto() || null;
        canvasDto.path = image?.path || '';
        return canvasDto;
    }

    async getByOrgId(orgId: string): Promise<CanvasInfoDto[]> {
        const listCanvasInfo = [];
        const canvases = await this.canvasRepository.find({
            where: {
                orgId,
            },
            relations: ['canvases'],
        });
        for (const canvas of canvases) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: canvas.categoryId,
                },
            });
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: canvas.imageId,
                },
            });

            const users = []
            for (const item of canvas.canvases) {
                const user = await this.userRepository.findOne(item.userId);
                users.push(user.toDto());
            }
            const canvasDto = canvas.toDto() as CanvasInfoDto;
            canvasDto.category = category?.toDto() || null;
            canvasDto.path = image?.path || '';
            canvasDto.users = users;
            listCanvasInfo.push(canvasDto);
        }
        return listCanvasInfo;
    }

    async create(
        userId: string,
        createCanvasDto: CreateCanvasDto,
    ): Promise<CreateCanvasDto> {
        await this.isAdminOrEditor(userId, createCanvasDto.orgId);
        const canvasModel = new CanvasEntity();
        canvasModel.name = createCanvasDto.name;
        canvasModel.orgId = createCanvasDto.orgId;
        canvasModel.createdUserId = userId;
        canvasModel.data = createCanvasDto.data || '';
        canvasModel.categoryId = createCanvasDto.categoryId;
        canvasModel.imageId = createCanvasDto.imageId;
        canvasModel.createdAt = new Date();
        canvasModel.updatedAt = new Date();
        const image = await this.uploadImageService.getImageById(
            createCanvasDto.imageId,
        );

        const canvasCreated = await this.canvasRepository.save(canvasModel);

        const canvasUserOrgModel = new CanvasUserOrgEntity();
        canvasUserOrgModel.canvasId = canvasCreated.id;
        canvasUserOrgModel.orgId = canvasCreated.orgId;
        canvasUserOrgModel.userId = canvasCreated.createdUserId;
        await this.canvasUserOrgRepository.save(canvasUserOrgModel);

        const canvasCreatedDto = canvasCreated.toDto() as CreateCanvasDto;
        // canvasCreatedDto.image = image.toDto();
        canvasCreatedDto.path = image?.path || '';
        canvasCreatedDto.categoryId = createCanvasDto.categoryId || '';
        canvasCreatedDto.imageId = createCanvasDto.imageId || '';
        return canvasCreatedDto;
    }

    async update(
        userId: string,
        updateCanvasDto: UpdateCanvasDto,
    ): Promise<UpdateCanvasDto> {
        const canvas = await this.canvasRepository.findOne(updateCanvasDto.id);
        if (!canvas) {
            throw new NotFoundException();
        }
        if(userId !== canvas.createdUserId) {
            await this.checkPermissionInBoard(userId, updateCanvasDto.id, updateCanvasDto.orgId)
        }

        canvas.name = updateCanvasDto.name || canvas.name;
        canvas.data = updateCanvasDto.data || canvas.data;
        canvas.categoryId = updateCanvasDto.categoryId || canvas.categoryId;
        canvas.imageId = updateCanvasDto.imageId || canvas.imageId;

        const image = await this.uploadImageService.getImageById(
            canvas.imageId,
        );

        const canvasUpdated = await this.canvasRepository.save(canvas);
        const canvasUpdatedDto = canvasUpdated.toDto() as UpdateCanvasDto;
        canvasUpdatedDto.path = image?.path || '';
        return canvasUpdatedDto;
    }

    async delete(
        userId: string,
        { canvasId, orgId }: DeleteCanvasDto,
    ): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.canvasUserOrgRepository.delete({
            canvasId,
            orgId,
        })
        await this.canvasRepository.delete(canvasId);
    }
}
