import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CanvasUserOrgTable1605635931902 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'canvas_user_org',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'canvasId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'orgId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'userId',
                    type: 'varchar',
                    length: '36',
                    isNullable: true,
                },
                {
                    name: 'permission',
                    type: 'enum',
                    enum: ['creator', 'admin', 'editor', 'view'],
                    enumName: 'permissionEnum',
                    isNullable: false,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('canvas_user_org');
    }
}
