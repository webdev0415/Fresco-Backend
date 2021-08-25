import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserRepository } from '../../modules/user/user.repository';

import {BoardUserOrgRepository} from '../../modules/board-user-org/board-user-org.repository';
import {CategoryRepository} from '../../modules/category/category.repository';
import {UploadImageModule} from '../../modules/upload/upload-image.module';
import {UploadImageRepository} from '../../modules/upload/upload-image.repository';
import {UserToOrgRepository} from '../../modules/user-org/user-org.repository';
import {BoardController} from './board.controller';
import {BoardRepository} from './board.repository';
import {BoardService} from './board.service';
import {UserToOrgModule} from "../user-org/user-org.module";
import {BoardUserOrgModule} from "../board-user-org/board-user-org.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserToOrgRepository,
            BoardRepository,
            BoardUserOrgRepository,
            UploadImageRepository,
            CategoryRepository,
            UserRepository
        ]),
        forwardRef(() => UploadImageModule),
        forwardRef(() => UserToOrgModule),
        forwardRef(() => BoardUserOrgModule),
    ],
    controllers: [BoardController],
    providers: [BoardService],
    exports: [BoardService],
})
export class BoardModule {}
