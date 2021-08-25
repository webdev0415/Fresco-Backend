/* eslint-disable complexity */
import {Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {UserRepository} from '../../modules/user/user.repository';

import {PermissionEnum} from '../../common/constants/permission';
import {BoardUserOrgEntity} from '../../modules/board-user-org/board-user-org.entity';
import {BoardUserOrgRepository} from '../../modules/board-user-org/board-user-org.repository';
import {CategoryRepository} from '../../modules/category/category.repository';
import {UploadImageRepository} from '../../modules/upload/upload-image.repository';
import {UploadImageService} from '../../modules/upload/upload-image.service';
import {UserToOrgRepository} from '../../modules/user-org/user-org.repository';
import {BoardEntity} from './board.entity';
import {BoardRepository} from './board.repository';
import {BoardInfoDto} from './dto/BoardInfoDto';
import {CreateBoardDto} from './dto/CreateBoardDto';
import {DeleteBoardDto} from './dto/DeleteBoardDto';
import {UpdateBoardDto} from './dto/UpdateBoardDto';
import {BoardUserOrgService} from "../board-user-org/board-user-org.service";

@Injectable()
export class BoardService {
    constructor(
        public readonly boardRepository: BoardRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly userRepository: UserRepository,
        public readonly categoryRepository: CategoryRepository,
        public readonly uploadImageService: UploadImageService,
        public readonly boardUserOrgService: BoardUserOrgService,
    ) {
    }

    async isAdminOrEditor(userId: string, orgId: string) {
        const userToOrg = await this.userToOrgRepository
            .createQueryBuilder('userToOrg')
            .where('userToOrg.userId = :userId', {userId})
            .andWhere('userToOrg.orgId = :orgId', {orgId})
            .andWhere(
                'userToOrg.permission = :admin Or userToOrg.permission = :editor',
                {admin: PermissionEnum.ADMIN, editor: PermissionEnum.EDITOR},
            )
            .getOne();
        // const userToOrg = await this.userToOrgRepository.find({
        //     where: {
        //         userId,
        //         orgId,
        //         and: [
        //             { permission: PermissionEnum.ADMIN },
        //             { permission: PermissionEnum.EDITOR },
        //         ],
        //     },
        // });

        if (!userToOrg) {
            throw new UnauthorizedException('');
        }
        return userToOrg;
    }

    async checkPermissionInBoard(
        userId: string,
        boardId: string,
        orgId: string,
    ) {
        const boardUserOrg = await this.boardUserOrgRepository
            .createQueryBuilder('boardUserOrgEntity')
            .where('boardUserOrgEntity.userId = :userId', {userId})
            .andWhere('boardUserOrgEntity.orgId = :orgId', {orgId})
            .andWhere('boardUserOrgEntity.boardId = :boardId', {boardId})
            .andWhere('boardUserOrgEntity.permission != :viewer', {
                viewer: PermissionEnum.VIEW,
            })
            .getOne();

        if (!boardUserOrg) {
            throw new UnauthorizedException();
        }

        return boardUserOrg;
    }

    async getById(id: string): Promise<BoardInfoDto> {
        const board = await this.boardRepository.findOne({
            where: {
                id,
            },
            relations: ["boards"]
        });


        if (!board) {
            throw new NotFoundException();
        }

        const category = await this.categoryRepository.findOne({
            where: {
                id: board.categoryId,
            },
        });
        const image = await this.uploadImageRepository.findOne({
            where: {
                id: board.imageId,
            },
        });

        const users = []
        for (const item of board.boards) {
            const user = await this.userRepository.findOne(item.userId);
            users.push(user.toDto());
        }
        const boardDto = board.toDto() as BoardInfoDto;
        boardDto.category = category?.toDto() || null;
        boardDto.path = image?.path || '';
        boardDto.users = users

        return boardDto;
    }

    async getByOrgIdAndUserId(userId: string, orgId: string) {

        let orgRelation = await this.userToOrgRepository.findOne({where: {userId: userId, orgId: orgId}})
        if (orgRelation.permission == PermissionEnum.LIMITED) {
            let boardRelations = await this.boardUserOrgService.GetAllBoards(userId, orgId);
            return this.ComposeBoardInfoFromBoards(boardRelations.map(item => item.board))
        } else {
            return await this.getByOrgId(orgId);
        }
    }

    async getByOrgId(orgId: string): Promise<BoardInfoDto[]> {

        const boards = await this.boardRepository.find({
            where: {
                orgId,
            },
            relations: ['boards'],
        });
        return this.ComposeBoardInfoFromBoards(boards);
    }

    async create(
        userId: string,
        createBoardDto: CreateBoardDto,
    ): Promise<CreateBoardDto> {
        await this.isAdminOrEditor(userId, createBoardDto.orgId);

        const boardModel = new BoardEntity();
        boardModel.name = createBoardDto.name;
        boardModel.orgId = createBoardDto.orgId;
        boardModel.data = createBoardDto.data || '';
        boardModel.createdUserId = userId;
        boardModel.categoryId = createBoardDto.categoryId;
        boardModel.imageId = createBoardDto.imageId;
        boardModel.createdAt = new Date();
        boardModel.updatedAt = new Date();

        const image = await this.uploadImageService.getImageById(
            createBoardDto.imageId,
        );

        const board = await this.boardRepository.save(boardModel);

        const boardUserOrgModel = new BoardUserOrgEntity();
        boardUserOrgModel.boardId = board.id;
        boardUserOrgModel.orgId = board.orgId;
        boardUserOrgModel.userId = board.createdUserId;
        await this.boardUserOrgRepository.save(boardUserOrgModel);

        const category = await this.categoryRepository.findOne({
            where: {
                id: createBoardDto.categoryId,
            },
        });

        const boardDto = board.toDto();
        boardDto.category = category?.toDto() || null;
        boardDto.path = image?.path || '';
        boardDto.categoryId = createBoardDto.categoryId || '';
        boardDto.imageId = createBoardDto.imageId || '';

        return boardDto;
    }

    async update(
        userId: string,
        updateBoardDto: UpdateBoardDto,
    ): Promise<BoardEntity> {
        const board = await this.boardRepository.findOne(updateBoardDto.id);
        if (!board) {
            throw new NotFoundException();
        }

        if (userId !== board.createdUserId) {
            await this.checkPermissionInBoard(
                userId,
                updateBoardDto.id,
                updateBoardDto.orgId,
            );
        }

        board.name = updateBoardDto.name || board.name;
        board.data = updateBoardDto.data || board.data;
        board.categoryId = updateBoardDto.categoryId || board.categoryId;
        board.imageId = updateBoardDto.imageId || board.imageId;

        const image = await this.uploadImageService.getImageById(board.imageId);

        const boardUpdated = await this.boardRepository.save(board);

        const category = await this.categoryRepository.findOne({
            where: {
                id: board.categoryId,
            },
        });

        const boardDto = boardUpdated.toDto();
        boardDto.category = category?.toDto() || null;
        boardDto.path = image?.path || '';

        return boardDto;
    }

    async delete({boardId, userId, orgId}: DeleteBoardDto): Promise<void> {
        await this.isAdminOrEditor(userId, orgId);
        await this.boardUserOrgRepository.delete({
            boardId,
            orgId,
        });
        await this.boardRepository.delete(boardId);
    }

    private async ComposeBoardInfoFromBoards(boards: BoardEntity[]) {
        const listBoardInfo: BoardInfoDto[] = [];
        for (const board of boards) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: board.categoryId,
                },
            });
            const image = await this.uploadImageRepository.findOne({
                where: {
                    id: board.imageId,
                },
            });

            const users = []
            for (const item of board.boards) {
                const user = await this.userRepository.findOne(item.userId);
                users.push(user.toDto());
            }

            const boardDto = board.toDto() as BoardInfoDto;
            boardDto.category = category?.toDto() || null;
            boardDto.path = image?.path || '';
            boardDto.users = users;
            listBoardInfo.push(boardDto);
        }
        return listBoardInfo;
    }
}
