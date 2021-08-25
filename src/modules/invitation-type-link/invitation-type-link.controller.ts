/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags} from '@nestjs/swagger';

import {InvitationType} from '../../common/constants/invitation-type';
import {AuthUser} from '../../decorators/auth-user.decorator';
import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {UserEntity} from '../../modules/user/user.entity';
import {CreateInvitationTypeLinkDto} from './dto/CreateInvitationTypeLinkDto';
import {DeleteInvitationTypeLinkDto} from './dto/DeleteInvitationTypeLinkDto';
import {HandleRequestInvitationLinkDto} from './dto/HandleRequestInvitationLinkDto';
import {InvitationTypeLinkDto} from './dto/InvitationTypeLinkDto';
import {InvitationTypeLinkInfoDto} from './dto/InvitationTypeLinkInfoDto';
import {InvitationTypeLinkEntity} from './invitation-type-link.entity';
import {InvitationTypeLinkService} from './invitation-type-link.service';
import {UpdateInvitationTypeLinkDto} from "./dto/UpdateInvitationTypeLinkDto";
import {GetUsersByBoardOrCanvasTypeDto} from "./dto/GetUsersByBoardOrCanvasTypeDto";
import {GetInvitationTypeLinkByTypeAndOrgDto} from "./dto/GetInvitationTypeLinkByTypeAndOrgDto";

@Controller('invitation-type')
@ApiTags('invitation-type')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class InvitationTypeLinkController {
    constructor(
        public readonly invitationTypeLinkService: InvitationTypeLinkService,
    ) {}

    @Post('')
    @ApiOkResponse({
        type: CreateInvitationTypeLinkDto,
        description: 'create invitation type link',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createInvitationTypeLinkDto: CreateInvitationTypeLinkDto,
    ): Promise<CreateInvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkService.create(
            user.id,
            createInvitationTypeLinkDto,
        );
        return invitationTypeLink.toDto();
    }

    @Post('request')
    @ApiOkResponse({
        type: CreateInvitationTypeLinkDto,
        description: 'handle request invitation type link',
    })
    async handleRequest(
        @AuthUser() user: UserEntity,
        @Body() handleRequestInvitationLinkDto: HandleRequestInvitationLinkDto,
    ): Promise<CreateInvitationTypeLinkDto> {
        const invitationTypeLink = await this.invitationTypeLinkService.handleRequest(
            user.id,
            handleRequestInvitationLinkDto,
        );
        return invitationTypeLink.toDto();
    }

    @Get('')
    @ApiOkResponse({
        type: GetInvitationTypeLinkByTypeAndOrgDto,
        description: 'get invitation type link by type and organization id',
    })
    @ApiQuery({ name: 'type', enum: InvitationType })
    @ApiQuery({ name: 'orgId' })
    @ApiQuery({ name: 'typeId' })
    async getInvitationTypeLinkByTypeAndOrgId(
        @AuthUser() user: UserEntity,
        @Query() query,
    ): Promise<GetInvitationTypeLinkByTypeAndOrgDto[]> {
        const invitationTypeLinkModel = new InvitationTypeLinkEntity();
        invitationTypeLinkModel.type = query.type;
        invitationTypeLinkModel.orgId = query.orgId;
        invitationTypeLinkModel.typeId = query.typeId;
        const invitationTypeLinkInfoDto = await this.invitationTypeLinkService.getInvitationTypeLinkByTypeAndOrgId(
            user.id,
            invitationTypeLinkModel,
        );
        return invitationTypeLinkInfoDto;
    }

    @Delete(':id')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'delete invitation type link',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
    ): Promise<InvitationTypeLinkDto> {
        const deleteInvitationTypeLinkDto = new DeleteInvitationTypeLinkDto()
        deleteInvitationTypeLinkDto.invitationTypeLinkId = id;
        deleteInvitationTypeLinkDto.createdUserId = user.id;
        const invitationTypeLinkInfoDto = await this.invitationTypeLinkService.delete(
            deleteInvitationTypeLinkDto
        );
        return invitationTypeLinkInfoDto;
    }

    @Get(':typeId/board')
    @ApiOkResponse({
        type: GetUsersByBoardOrCanvasTypeDto,
        description: 'get list user by board Id',
    })
    async getUserOrgByBoard(
        @AuthUser() user: UserEntity,
        @Param('typeId') typeId: string,
    ): Promise<GetUsersByBoardOrCanvasTypeDto[]> {
        const userByType = await this.invitationTypeLinkService.getUsersInType(
            InvitationType.BOARD,
            typeId,
        );
        return userByType;
    }

    @Get(':typeId/canvas')
    @ApiOkResponse({
        type: GetUsersByBoardOrCanvasTypeDto,
        description: 'get list user by canvas Id',
    })
    async getUserOrgByCanvas(
        @AuthUser() user: UserEntity,
        @Param('typeId') typeId: string,
    ): Promise<GetUsersByBoardOrCanvasTypeDto[]> {
        const userByType = await this.invitationTypeLinkService.getUsersInType(
            InvitationType.CANVAS,
            typeId,
        );
        return userByType;
    }

    @Put(':id/canvas')
    @ApiOkResponse({
        type: UpdateInvitationTypeLinkDto,
        description: 'update invitation canvas link',
    })
    async updateInvitationCanvasLink(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() invitationTypeLinkUpdateDto: UpdateInvitationTypeLinkDto,
    ): Promise<UpdateInvitationTypeLinkDto> {
        invitationTypeLinkUpdateDto.id = id;
        invitationTypeLinkUpdateDto.type = InvitationType.CANVAS;
        invitationTypeLinkUpdateDto.createdUserId = user.id;
        const invitationTypeLinkUpdated = await this.invitationTypeLinkService.update(
            invitationTypeLinkUpdateDto
        );
        return invitationTypeLinkUpdated;
    }

    @Put(':id/board')
    @ApiOkResponse({
        type: UpdateInvitationTypeLinkDto,
        description: 'update invitation canvas link',
    })
    async updateInvitationBoardLink(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() invitationTypeLinkUpdateDto: UpdateInvitationTypeLinkDto,
    ): Promise<UpdateInvitationTypeLinkDto> {
        invitationTypeLinkUpdateDto.id = id;
        invitationTypeLinkUpdateDto.type = InvitationType.BOARD;
        invitationTypeLinkUpdateDto.createdUserId = user.id;
        const invitationTypeLinkUpdated = await this.invitationTypeLinkService.update(
            invitationTypeLinkUpdateDto
        );
        return invitationTypeLinkUpdated;
    }

    @Get(':typeId/canvas-link')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'get list user by canvas Id',
    })
    async getLinkByCanvas(
        @AuthUser() user: UserEntity,
        @Param('typeId') typeId: string,
    ): Promise<InvitationTypeLinkDto> {
        const link = await this.invitationTypeLinkService.getLinkByTypeId(
            InvitationType.CANVAS,
            typeId
        );
        return link;
    }

    @Get(':typeId/board-link')
    @ApiOkResponse({
        type: InvitationTypeLinkDto,
        description: 'get list user by board Id',
    })
    async getLinkByBoard(
        @AuthUser() user: UserEntity,
        @Param('typeId') typeId: string,
    ): Promise<InvitationTypeLinkDto> {
        const link = await this.invitationTypeLinkService.getLinkByTypeId(
            InvitationType.BOARD,
            typeId
        );
        return link;
    }
}
