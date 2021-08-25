import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageIdCategoryTable1605369419297
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `category` ADD `imageId` varchar(36)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('category', 'imageId');
    }
}
