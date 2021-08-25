import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryIdDefaultTemplate1605210524569
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `default_template` ADD `categoryId` varchar(36)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('default_template', 'categoryId');
    }
}
