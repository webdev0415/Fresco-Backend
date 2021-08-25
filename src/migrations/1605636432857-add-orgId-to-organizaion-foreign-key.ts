import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddOrgIdToOrganizaionForeignKey1605636432857
    implements MigrationInterface {
    private _orgIdToOrganizationsForeignKey = new TableForeignKey({
        name: 'fk_canvasUserOrg_org',
        columnNames: ['orgId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organization',
    });

    private _canvasIdToCanvasForeignKey = new TableForeignKey({
        name: 'fk_canvasUserOrg_canvas',
        columnNames: ['canvasId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'canvas',
    });

    private _userIdToUserForeignKey = new TableForeignKey({
        name: 'fk_canvasUserOrg_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'canvas_user_org',
            this._orgIdToOrganizationsForeignKey,
        );
        await queryRunner.createForeignKey(
            'canvas_user_org',
            this._canvasIdToCanvasForeignKey,
        );
        await queryRunner.createForeignKey(
            'canvas_user_org',
            this._userIdToUserForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'canvas_user_org',
            this._orgIdToOrganizationsForeignKey,
        );
        await queryRunner.dropForeignKey(
            'canvas_user_org',
            this._canvasIdToCanvasForeignKey,
        );
        await queryRunner.dropForeignKey(
            'canvas_user_org',
            this._userIdToUserForeignKey,
        );
    }
}
