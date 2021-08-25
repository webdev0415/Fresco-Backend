import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtUpdatedAtBoardTable1604917209768
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `board` ADD `createdAt` timestamp NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE `board` ADD `updatedAt` timestamp NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('board', 'createdAt');
        await queryRunner.dropColumn('board', 'updatedAt');
    }
}
