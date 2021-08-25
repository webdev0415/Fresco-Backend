import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageIdAndCategoryIdToBoardTable1605363361008
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `board` ADD `categoryId` varchar(36)',
        );
        await queryRunner.query(
            'ALTER TABLE `board` ADD `imageId` varchar(36)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('board', 'imageId');
        await queryRunner.dropColumn('board', 'categoryId');
    }
}
