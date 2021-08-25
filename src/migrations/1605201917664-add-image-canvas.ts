import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageCanvas1605201917664 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `canvas` ADD `imageId` varchar(36)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('canvas', 'imageId');
    }
}
