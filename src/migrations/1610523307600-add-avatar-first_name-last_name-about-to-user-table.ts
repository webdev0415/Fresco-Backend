import {MigrationInterface, QueryRunner} from "typeorm";

export class addAvatarFirstNameLastNameAboutToUserTable1610523307600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `user` ADD `avatar` VARCHAR(255) DEFAULT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE `user` ADD `first_name` VARCHAR(255) DEFAULT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE `user` ADD `last_name` VARCHAR(255) DEFAULT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE `user` ADD `about` VARCHAR(255) DEFAULT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'avatar');
        await queryRunner.dropColumn('user', 'first_name');
        await queryRunner.dropColumn('user', 'last_name');
        await queryRunner.dropColumn('user', 'about');
    }
}
