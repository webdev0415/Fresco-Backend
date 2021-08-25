import { Injectable } from '@nestjs/common';

import { PermissionEnum } from '../../common/constants/permission';
import { UserToOrgDto } from '../user-org/dto/user-orgDto';
import { UserToOrgEntity } from '../user-org/user-org.entity';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { OrganizationEntity } from './organization.entity';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
    constructor(
        public readonly organizationRepository: OrganizationRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
    ) {}

    async create(
        userId: string,
        createOrganizationDto: CreateOrganizationDto,
    ): Promise<OrganizationEntity> {
        const organization = this.organizationRepository.create({
            name: createOrganizationDto.name,
            lName: createOrganizationDto.lName,
            fName: createOrganizationDto.fName,
            slug: createOrganizationDto.slug,
        });

        const organizationSave = await this.organizationRepository.save(
            organization,
        );
        const userToOrgModel = new UserToOrgEntity();
        userToOrgModel.orgId = organizationSave.id;
        userToOrgModel.userId = userId;
        userToOrgModel.permission = PermissionEnum.ADMIN;

        await this.userToOrgRepository.save(userToOrgModel);
        return organizationSave;
    }

    async isOrganizationNameExist(name: string): Promise<boolean> {
        return (await this.organizationRepository.count({ name })) > 0;
    }

    async getOrganizationByUserId(userId: string): Promise<UserToOrgDto[]> {
        const organizations = await this.userToOrgRepository.find({
            where: {
                userId,
            },
            relations: ['organization'],
        });

        return organizations.map((item) => item.toDto());
    }

    async getOrganizationByUserAndOrgId(
        userId: string,
        orgId: string,
    ): Promise<UserToOrgDto> {
        const organization = await this.userToOrgRepository.findOne({
            where: {
                orgId,
                userId,
            },
            relations: ['organization'],
        });

        return organization?.toDto();
    }
}
