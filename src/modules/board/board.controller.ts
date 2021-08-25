/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {AuthUser} from '../../decorators/auth-user.decorator';
import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {UserEntity} from '../../modules/user/user.entity';
import {BoardService} from './board.service';
import {BoardDto} from './dto/BoardDto';
import {BoardInfoDto} from './dto/BoardInfoDto';
import {CreateBoardDto} from './dto/CreateBoardDto';
import {DeleteBoardDto} from './dto/DeleteBoardDto';
import {UpdateBoardDto} from './dto/UpdateBoardDto';

@Controller('board')
@ApiTags('board')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class BoardController {
    constructor(public readonly boardService: BoardService) {}

    @Get(':id')
    @ApiOkResponse({
        type: BoardDto,
        description: 'get list board by orgId',
    })
    async getById(@Param('id') id: string): Promise<BoardInfoDto> {
        const board = await this.boardService.getById(id)
        return board;
    }

    @Get('organization/:orgId')
    @ApiOkResponse({
        type: BoardDto,
        description: 'get list board by orgId',
    })
    async getByOrgId(  @AuthUser() user: UserEntity,@Param('orgId') orgId: string): Promise<BoardInfoDto[]> {
        const boards = await this.boardService.getByOrgIdAndUserId(user.id,orgId);
        return boards;
    }

    @Post('')
    @ApiOkResponse({
        type: BoardDto,
        description: 'create board',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createBoardDto: CreateBoardDto,
    ): Promise<CreateBoardDto> {
        // console.log('user');
        // return null
        const board = await this.boardService.create(user.id, createBoardDto);
        return board;
    }

    @Put(':id')
    @ApiOkResponse({
        type: BoardDto,
        description: 'update board',
    })
    async update(
        @AuthUser() user: UserEntity,
        @Param('id') id: string,
        @Body() updateBoardDto: UpdateBoardDto,
    ): Promise<BoardDto> {
        updateBoardDto.id = id;
        const board = await this.boardService.update(user.id, updateBoardDto);
        return board;
    }

    @Delete(':id')
    @ApiOkResponse({
        type: BoardDto,
        description: 'delete board',
    })
    async delete(
        @AuthUser() user: UserEntity,
        @Body() deleteBoardDto: DeleteBoardDto,
        @Param('id') id: string,
    ): Promise<void> {
        deleteBoardDto.boardId = id;
        deleteBoardDto.userId = user.id;
        await this.boardService.delete(deleteBoardDto);
    }
}
