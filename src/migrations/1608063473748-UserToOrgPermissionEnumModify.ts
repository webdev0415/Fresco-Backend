import {MigrationInterface, QueryRunner} from "typeorm";

export class UserToOrgPermissionEnumModify1608063473748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        queryRunner.query('ALTER TABLE `user_org` CHANGE `permission` `permission` ENUM(\'admin\',\'editor\',\'view\',\'limited\',\'owner\') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;')


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query('ALTER TABLE `user_org` CHANGE `permission` `permission` ENUM(\'admin\',\'editor\',\'view\',\'owner\') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;')


    }
}
