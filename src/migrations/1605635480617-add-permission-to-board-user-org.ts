import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPermissionToBoardUserOrg1605635480617
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'board_user_org',
            new TableColumn({
                name: 'permission',
                type: 'enum',
                enum: ['creator', 'admin', 'editor', 'view'],
                enumName: 'permissionEnum',
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('board_user_org', 'permission');
    }
}
