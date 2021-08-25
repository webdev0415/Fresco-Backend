import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BoardTable1604508123365 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'board',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'name',
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
                    name: 'createdUserId',
                    type: 'varchar',
                    length: '36',
                    isNullable: true,
                },
                {
                    name: 'data',
                    type: 'longtext',
                    isNullable: false,
                },
                // {
                //     name: 'createdAt',
                //     type: 'datetime',
                //     isPrimary: false,
                //     isNullable: true,
                //     default: 'CURRENT_TIMESTAMP',
                // },
                // {
                //     name: 'updatedAt',
                //     type: 'datetime',
                //     isPrimary: false,
                //     isNullable: true,
                //     default: 'CURRENT_TIMESTAMP',
                // },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('board');
    }
}
