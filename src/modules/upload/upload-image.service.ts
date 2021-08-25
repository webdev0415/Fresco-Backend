import {Injectable, NotFoundException} from '@nestjs/common';

import {FileNotImageException} from '../../exceptions/file-not-image.exception';
import {IFile} from '../../interfaces/IFile';
import {CanvasRepository} from '../../modules/canvas/canvas.repository';
import {AwsS3Service} from '../../shared/services/aws-s3.service';
import {ValidatorService} from '../../shared/services/validator.service';
import {CreateUploadImageDto} from './dto/CreateUploadImageDto';
import {UploadImageEntity} from './upload-image.entity';
import {UploadImageRepository} from './upload-image.repository';

@Injectable()
export class UploadImageService {
    constructor(
        public readonly uploadImageRepository: UploadImageRepository,
        public readonly canvasRepository: CanvasRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    // eslint-disable-next-line complexity
    async create(
        uploadImageDto: CreateUploadImageDto,
        file: IFile,
    ): Promise<UploadImageEntity> {
        const uploadImageModel = new UploadImageEntity();
        uploadImageModel.type = uploadImageDto.type;
        uploadImageModel.createdAt = new Date();
        uploadImageModel.updatedAt = new Date();

        if (!file || !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        const path = await this.awsS3Service.uploadImage(file);
        return this.uploadImageRepository.save({
            ...uploadImageModel,
            path,
        });
    }

    // eslint-disable-next-line complexity
    async update(
        uploadImageDto: CreateUploadImageDto,
        id: string,
        file: IFile,
    ): Promise<UploadImageEntity> {
        const image = await this.uploadImageRepository.findOne({
            where: {
                id,
            },
        });

        let path: string;

        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        if (file) {
            path = await this.awsS3Service.uploadImage(file);
        }

        if (image) {
            image.updatedAt = new Date();
            image.path = path;
            return this.uploadImageRepository.save(image);
        }

        const uploadImageModel = new UploadImageEntity();
        uploadImageModel.type = uploadImageDto.type;
        uploadImageModel.createdAt = new Date();
        uploadImageModel.updatedAt = new Date();
        uploadImageModel.path = path;

        return this.uploadImageRepository.save(uploadImageModel);
    }

    async getImageById(id: string): Promise<UploadImageEntity> {
        if (!id) {
            return null;
        }
        const image = await this.uploadImageRepository.findOne({
            where: {
                id,
            },
        });

        if (!image) {
            throw new NotFoundException('ImageId is not valid');
        }
        return image;
    }
}
