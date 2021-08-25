/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {AuthUser} from '../../decorators/auth-user.decorator';
import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {UserEntity} from '../user/user.entity';
import {CanvasService} from './canvas.service';
import {CanvasDto} from './dto/CanvasDto';
import {CanvasInfoDto} from './dto/CanvasInfoDto';
import {CreateCanvasDto} from './dto/CreateCanvasDto';
import {DeleteCanvasDto} from './dto/DeleteCanvasDto';
import {UpdateCanvasDto} from './dto/UpdateCanvasDto';

@Controller('canvas')
@ApiTags('canvas')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class CanvasController {
    constructor(public readonly canvasService: CanvasService) {}

    @Get(':id')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'get detail canvas',
    })
    async getCanvas(@Param('id') id: string): Promise<CanvasInfoDto> {
        const canvas = await this.canvasService.getById(id);
        return canvas;
    }

    @Get('organization/:orgId')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'get list canvas by orgId',
    })
    async get(@Param('orgId') orgId: string): Promise<CanvasInfoDto[]> {
        const canvases = await this.canvasService.getByOrgId(orgId);
        return canvases;
    }

    @Post('')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'create canvas',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createCanvasDto: CreateCanvasDto,
    ): Promise<CreateCanvasDto> {
        const canvas = await this.canvasService.create(
            user.id,
            createCanvasDto,
        );
        return canvas;
    }

    @Put(':id')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'update canvas',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateCanvasDto: UpdateCanvasDto,
    ): Promise<UpdateCanvasDto> {
        updateCanvasDto.id = id;
        const canvas = await this.canvasService.update(
            user.id,
            updateCanvasDto,
        );
        return canvas;
    }

    @Delete(':id')
    @ApiOkResponse({
        type: CanvasDto,
        description: 'delete canvas',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() deleteCanvasDto: DeleteCanvasDto,
    ): Promise<void> {
        deleteCanvasDto.canvasId = id;
        await this.canvasService.delete(user.id, deleteCanvasDto);
    }
}
