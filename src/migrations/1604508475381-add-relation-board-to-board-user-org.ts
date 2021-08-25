import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationBoardToBoardUserOrg1604508475381
    implements MigrationInterface {
    private _orgIdToOrganizations123ForeignKey = new TableForeignKey({
        name: 'fk_boardUserOrg_org',
        columnNames: ['orgId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organization',
    });

    private _orgIdToOrganizations1231ForeignKey = new TableForeignKey({
        name: 'fk_boardUserOrg_board',
        columnNames: ['boardId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'board',
    });

    private _orgIdToOrganizations1233ForeignKey = new TableForeignKey({
        name: 'fk_boardUserOrg_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'board_user_org',
            this._orgIdToOrganizations123ForeignKey,
        );
        await queryRunner.createForeignKey(
            'board_user_org',
            this._orgIdToOrganizations1231ForeignKey,
        );
        await queryRunner.createForeignKey(
            'board_user_org',
            this._orgIdToOrganizations1233ForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'board_user_org',
            this._orgIdToOrganizations123ForeignKey,
        );
        await queryRunner.dropForeignKey(
            'board_user_org',
            this._orgIdToOrganizations1231ForeignKey,
        );
        await queryRunner.dropForeignKey(
            'board_user_org',
            this._orgIdToOrganizations1233ForeignKey,
        );
    }
}
