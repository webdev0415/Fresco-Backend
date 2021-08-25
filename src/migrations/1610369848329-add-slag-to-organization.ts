import {MigrationInterface, QueryRunner} from "typeorm";

export class addSlagToOrganization1610369848329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `organization` ADD `slug` varchar(255) UNIQUE ;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('organization', 'slug');
    }

}
