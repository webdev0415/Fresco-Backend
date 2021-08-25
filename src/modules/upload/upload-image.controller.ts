/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Controller, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors,} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {AuthGuard} from '../../guards/auth.guard';
import {RolesGuard} from '../../guards/roles.guard';
import {AuthUserInterceptor} from '../../interceptors/auth-user-interceptor.service';
import {IFile} from '../../interfaces/IFile';
import {UploadImageDto} from './dto/UploadImageDto';
import {UploadImageService} from './upload-image.service';

@Controller('upload')
@ApiTags('upload')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class UploadImageController {
    constructor(public readonly uploadImageService: UploadImageService) {}

    @Post('/image/:type')
    @ApiOkResponse({
        type: UploadImageDto,
        description: 'create upload image',
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('type') typeUpload: string,
        @UploadedFile() file: IFile,
    ): Promise<UploadImageDto> {
        // console.log('file', file);
        const uploadImage = await this.uploadImageService.create(
            { type: typeUpload },
            file,
        );
        return uploadImage;
    }

    @Put('/image/:type/:id')
    @ApiOkResponse({
        type: UploadImageDto,
        description: 'create upload image',
    })
    @UseInterceptors(FileInterceptor('file'))
    async updateImage(
        @Param('type') typeUpload: string,
        @Param('id') id: string,
        @UploadedFile() file: IFile,
    ): Promise<UploadImageDto> {
        // console.log('file', file);
        const uploadImage = await this.uploadImageService.update(
            { type: typeUpload },
            id,
            file,
        );
        return uploadImage.toDto();
    }
}
