import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtUpdatedAtCanvasTable1604917449305
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `canvas` ADD `createdAt` timestamp NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE `canvas` ADD `updatedAt` timestamp NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('canvas', 'createdAt');
        await queryRunner.dropColumn('canvas', 'updatedAt');
    }
}
