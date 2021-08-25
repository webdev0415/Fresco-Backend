import { Injectable, NotFoundException } from '@nestjs/common';

import { InvitationType } from '../../common/constants/invitation-type';
import { PermissionEnum } from '../../common/constants/permission';
import { InvitationAcceptedException } from '../../exceptions/accepted-invitation';
import { InvitationLimitedException } from '../../exceptions/invitation-limited';
import { BoardUserOrgEntity } from '../../modules/board-user-org/board-user-org.entity';
import { BoardUserOrgRepository } from '../../modules/board-user-org/board-user-org.repository';
import { BoardRepository } from '../../modules/board/board.repository';
import { CanvasUserOrgEntity } from '../../modules/canvas-user-org/canvas-user-org.entity';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';
import { CanvasRepository } from '../../modules/canvas/canvas.repository';
import { CanvasService } from '../../modules/canvas/canvas.service';
import { InvitationTypeLinkUserService } from '../../modules/invitation-type-link-user/invitation-type-link-user.service';
import { OrganizationRepository } from '../../modules/organization/organization.repository';
import { UserToOrgEntity } from '../../modules/user-org/user-org.entity';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { ConfigService } from '../../shared/services/config.service';
import { BoardInfoDto } from '../board/dto/BoardInfoDto';
import { CanvasInfoDto } from '../canvas/dto/CanvasInfoDto';
import { UpdateCategoryDto } from '../category/dto/UpdateCategoryDto';
import { OrganizationEntity } from '../organization/organization.entity';
import { UserRepository } from '../user/user.repository';
import { CreateInvitationTypeLinkDto } from './dto/CreateInvitationTypeLinkDto';
import { DeleteInvitationTypeLinkDto } from './dto/DeleteInvitationTypeLinkDto';
import { GetInvitationTypeLinkByTypeAndOrgDto } from './dto/GetInvitationTypeLinkByTypeAndOrgDto';
import { GetUsersByBoardOrCanvasTypeDto } from './dto/GetUsersByBoardOrCanvasTypeDto';
import { HandleRequestInvitationLinkDto } from './dto/HandleRequestInvitationLinkDto';
import { InvitationTypeLinkDto } from './dto/InvitationTypeLinkDto';
import { InvitationTypeLinkInfoDto } from './dto/InvitationTypeLinkInfoDto';
import { UpdateInvitationTypeLinkDto } from './dto/UpdateInvitationTypeLinkDto';
import { InvitationTypeLinkEntity } from './invitation-type-link.entity';
import { InvitationTypeLinkRepository } from './invitation-type-link.repository';

@Injectable()
export class InvitationTypeLinkService {
    constructor(
        public readonly invitationTypeLinkRepository: InvitationTypeLinkRepository,
        public readonly canvasService: CanvasService,
        public readonly organizationRepository: OrganizationRepository,
        public readonly canvasRepository: CanvasRepository,
        public readonly boardRepository: BoardRepository,
        public readonly configService: ConfigService,
        public readonly invitationTypeLinkUserService: InvitationTypeLinkUserService,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
        public readonly canvasUserOrgRepository: CanvasUserOrgRepository,
        public readonly userRespository: UserRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        userId: string,
        createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<InvitationTypeLinkEntity> {
        const org = await this.organizationRepository.findOne({
            where: {
                id: createInvitationTypeLinkDto.orgId,
            },
        });
        if (!org) {
            throw new NotFoundException('orgId is not valid');
        }
        await this.canvasService.isAdminOrEditor(
            userId,
            createInvitationTypeLinkDto.orgId,
        );

        let typeData;
        if (createInvitationTypeLinkDto.type === InvitationType.CANVAS) {
            typeData = await this.canvasRepository.findOne({
                where: {
                    id: createInvitationTypeLinkDto.typeId,
                },
            });
        } else {
            typeData = await this.boardRepository.findOne({
                where: {
                    id: createInvitationTypeLinkDto.typeId,
                },
            });
        }

        if (!typeData) {
            throw new NotFoundException('typeId is not valid');
        }

        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.token = createInvitationTypeLinkDto.token;
        invitationTypeLinkModel.createdUserId = userId;
        invitationTypeLinkModel.orgId = createInvitationTypeLinkDto.orgId;
        invitationTypeLinkModel.numberOfUser = 0;
        invitationTypeLinkModel.type = createInvitationTypeLinkDto.type;
        invitationTypeLinkModel.permission =
            createInvitationTypeLinkDto.permission;
        invitationTypeLinkModel.typeId = createInvitationTypeLinkDto.typeId;
        invitationTypeLinkModel.isDeleted = false;

        return this.invitationTypeLinkRepository.save(invitationTypeLinkModel);
    }

    // eslint-disable-next-line complexity
    async handleRequest(
        userId: string,
        handleRequestInvitationLinkDto: HandleRequestInvitationLinkDto,
    ): Promise<InvitationTypeLinkEntity> {
        const invitationTypeLink = await this.invitationTypeLinkRepository.findOne(
            {
                where: {
                    token: handleRequestInvitationLinkDto.token,
                },
            },
        );
        if (!invitationTypeLink) {
            throw new NotFoundException('token is not valid');
        }

        // check if user is him/her self
        if (userId === invitationTypeLink.createdUserId) {
            throw new InvitationAcceptedException(
                'You created this invitation',
            );
        }

        const invitationTypeLinkUser = await this.invitationTypeLinkUserService.getInvitationTypeLinkUser(
            invitationTypeLink.id,
            userId,
        );
        if (invitationTypeLinkUser) {
            throw new InvitationAcceptedException(
                'You accepted this invitation',
            );
        }

        // compare number of user
        const numberOfUser = this.configService.getNumber('NUMBER_OF_USER');
        if (invitationTypeLink.numberOfUser >= numberOfUser - 1) {
            throw new InvitationLimitedException('Invitation is limited');
        }

        // create invitationTypeLinkUserService
        await this.invitationTypeLinkUserService.create({
            userId,
            invitationTypeLinkId: invitationTypeLink.id,
        });
        // update numberOfUser
        invitationTypeLink.numberOfUser += 1;
        const invitationTypeLinkUpdated = await this.invitationTypeLinkRepository.save(
            invitationTypeLink,
        );

        // check if have user_org record
        const userOrg = await this.userToOrgRepository.findOne({
            where: {
                userId,
                orgId: invitationTypeLink.orgId,
            },
        });
        if (!userOrg) {
            const userToOrgModel = new UserToOrgEntity();
            userToOrgModel.orgId = invitationTypeLink.orgId;
            userToOrgModel.userId = userId;
            userToOrgModel.permission = invitationTypeLink.permission;

            await this.userToOrgRepository.save(userToOrgModel);
        }

        // create ${type}_user_org record
        if (invitationTypeLink.type === InvitationType.CANVAS) {
            const canvasUserOrgModel = new CanvasUserOrgEntity();
            canvasUserOrgModel.canvasId = invitationTypeLink.typeId;
            canvasUserOrgModel.orgId = invitationTypeLink.orgId;
            canvasUserOrgModel.permission = invitationTypeLink.permission;
            canvasUserOrgModel.userId = userId;
            await this.canvasUserOrgRepository.save(canvasUserOrgModel);
        } else {
            const boardUserOrgModel = new BoardUserOrgEntity();
            boardUserOrgModel.boardId = invitationTypeLink.typeId;
            boardUserOrgModel.orgId = invitationTypeLink.orgId;
            boardUserOrgModel.userId = userId;
            boardUserOrgModel.permission = invitationTypeLink.permission;
            await this.boardUserOrgRepository.save(boardUserOrgModel);
        }

        return invitationTypeLinkUpdated;
    }

    async getInvitationTypeLinkByTypeAndOrgId(
        userId: string,
        invitationTypeLinkEntity: InvitationTypeLinkEntity,
    ): Promise<GetInvitationTypeLinkByTypeAndOrgDto[]> {
        const type = invitationTypeLinkEntity.type;
        const result: GetInvitationTypeLinkByTypeAndOrgDto[] = [];
        const invitationTypeLinks = await this.invitationTypeLinkRepository
            .createQueryBuilder('invitation_type_link')
            .innerJoinAndSelect(`invitation_type_link.${type}`, `${type}`)
            .innerJoinAndSelect(
                'invitation_type_link.organization',
                'organization',
            )
            .where(
                'invitation_type_link.type = :type AND invitation_type_link.typeId = :typeId AND invitation_type_link.orgId = :orgId AND invitation_type_link.isDeleted = :isDeleted',
                {
                    type,
                    typeId: invitationTypeLinkEntity.typeId,
                    orgId: invitationTypeLinkEntity.orgId,
                    isDeleted: 0,
                },
            )
            .getMany();

        invitationTypeLinks.forEach((item) => {
            result.push({
                id: item.id,
                token: item.token,
                orgId: item.orgId,
                createdUserId: item.createdUserId,
                permission: item.permission,
                numberOfUser: item.numberOfUser,
                type: item.type,
                typeId: item.typeId,
                isDeleted: item.isDeleted,
                organization: item.organization,
                boardOrCanvas:
                    type === InvitationType.CANVAS ? item.canvas : item.board,
            });
        });

        return result;
    }

    async delete({
        invitationTypeLinkId,
        createdUserId,
    }: DeleteInvitationTypeLinkDto): Promise<InvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkRepository.findOne(
            {
                where: {
                    id: invitationTypeLinkId,
                    createdUserId,
                    isDeleted: 0,
                },
            },
        );
        if (!invitationTypeLink) {
            throw new NotFoundException();
        }
        invitationTypeLink.isDeleted = true;
        const invitationTypeLinkDeleted = await this.invitationTypeLinkRepository.save(
            invitationTypeLink,
        );
        return invitationTypeLinkDeleted.toDto() as InvitationTypeLinkDto;
    }

    async getUsersInType(
        type: InvitationType,
        typeId: string,
    ): Promise<GetUsersByBoardOrCanvasTypeDto[]> {
        let relation = null;
        let repository = null;
        let condition = null;
        const result: GetUsersByBoardOrCanvasTypeDto[] = [];
        if (type === InvitationType.CANVAS) {
            relation = 'canvases';
            repository = this.canvasUserOrgRepository;
            condition = `${type}_user_org.canvasId = :typeId`;
        } else {
            relation = 'boards';
            repository = this.boardUserOrgRepository;
            condition = `${type}_user_org.boardId = :typeId`;
        }
        const boardUserOrg = await repository
            .createQueryBuilder(`${type}_user_org`)
            .innerJoinAndSelect(`${type}_user_org.user`, 'user')
            .innerJoinAndSelect(`${type}_user_org.organization`, 'organization')
            .select([
                'user.email',
                'user.name',
                `${type}_user_org.permission`,
                'organization.name',
                'organization.lName',
                'organization.fName',
            ])
            .where(condition, { typeId })
            .getMany();
        boardUserOrg.forEach((item) => {
            result.push({
                email: item.user.email,
                name: item.user.name,
                permission: item.permission,
                organizationName: item.organization.name,
                lName: item.organization.lName,
                fName: item.organization.fName,
            });
        });
        return result;
    }

    async update(
        invitationTypeLinkUpdateDto: UpdateInvitationTypeLinkDto,
    ): Promise<UpdateInvitationTypeLinkDto> {
        const typeEntity = await this.invitationTypeLinkRepository.findOne({
            where: {
                id: invitationTypeLinkUpdateDto.id,
                type: invitationTypeLinkUpdateDto.type,
                createdUserId: invitationTypeLinkUpdateDto.createdUserId,
            },
        });
        if (!typeEntity) {
            throw new NotFoundException();
        }
        typeEntity.permission =
            invitationTypeLinkUpdateDto.permission || typeEntity.permission;
        const invitationTypeLinkUpdated = await this.invitationTypeLinkRepository.save(
            typeEntity,
        );
        const invitationTypeLinkUpdatedDto = invitationTypeLinkUpdated.toDto() as UpdateInvitationTypeLinkDto;
        return invitationTypeLinkUpdatedDto;
    }

    async getLinkByTypeId(
        type: InvitationType,
        typeId: string,
    ): Promise<InvitationTypeLinkDto> {
        const invitationTypeLinkEntity = await this.invitationTypeLinkRepository.findOne(
            {
                where: {
                    typeId,
                    type,
                },
            },
        );
        if (!invitationTypeLinkEntity) {
            throw new NotFoundException();
        }
        return invitationTypeLinkEntity.toDto();
    }
}
