/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDataCategoryTable1605203262313 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Customer Journey Maps", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Innovation", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Business model", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Product", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Marketing", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
        await queryRunner.query(
            'INSERT INTO `category`(`id`, `name`, `createdAt`, `updatedAt`) VALUES (UUID(), "Custom", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM `category`');
    }
}
