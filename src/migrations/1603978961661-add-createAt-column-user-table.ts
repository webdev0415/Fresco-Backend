import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateAtColumnUserTable1603978961661
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `user` ADD `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'createdAt');
    }
}
