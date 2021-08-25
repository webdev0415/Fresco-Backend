import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageIdDefaultTemplate1605360173481
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `default_template` ADD `imageId` varchar(36)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('default_template', 'imageId');
    }
}
