import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationOrganizationUser1603908650047
    implements MigrationInterface {
    private _userOrgToUserForeignKey = new TableForeignKey({
        name: 'fk_userOrg_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
    });

    private _userOrgToOrgForeignKey = new TableForeignKey({
        name: 'fk_userOrg_org',
        columnNames: ['orgId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organization',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'user_org',
            this._userOrgToUserForeignKey,
        );
        await queryRunner.createForeignKey(
            'user_org',
            this._userOrgToOrgForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'user_org',
            this._userOrgToUserForeignKey,
        );
        await queryRunner.dropForeignKey(
            'user_org',
            this._userOrgToOrgForeignKey,
        );
    }
}
