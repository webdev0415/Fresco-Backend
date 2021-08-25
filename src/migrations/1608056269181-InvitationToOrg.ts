import {MigrationInterface, QueryRunner} from "typeorm";

export class InvitationToOrg1608056269181 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `invitation` ADD `board` varchar(100)',
        );
        await queryRunner.query(
            'ALTER TABLE `invitation` ADD `boardPermission` varchar(30)',
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('invitation', 'boardPermission');
        await queryRunner.dropColumn('invitation', 'board');
    }

}
