import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BoardUserOrgTable1604508208353 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'board_user_org',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'boardId',
                    type: 'varchar',
                    length: '225',
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
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('board_user_org');
    }
}
