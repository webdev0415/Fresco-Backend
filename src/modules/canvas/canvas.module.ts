import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../../modules/user/user.repository';
import { CanvasUserOrgRepository } from '../../modules/canvas-user-org/canvas-user-org.repository';

import { CategoryRepository } from '../../modules/category/category.repository';
import { UploadImageModule } from '../../modules/upload/upload-image.module';
import { UploadImageRepository } from '../../modules/upload/upload-image.repository';
import { UserToOrgRepository } from '../user-org/user-org.repository';
import { CanvasController } from './canvas.controller';
import { CanvasRepository } from './canvas.repository';
import { CanvasService } from './canvas.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserToOrgRepository,
            CanvasRepository,
            CategoryRepository,
            UploadImageRepository,
            CanvasUserOrgRepository,
            UserRepository,
        ]),
        forwardRef(() => UploadImageModule),
    ],
    controllers: [CanvasController],
    providers: [CanvasService],
    exports: [CanvasService],
})
export class CanvasModule {}
