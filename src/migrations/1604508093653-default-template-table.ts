import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DefaultTemplateTable1604508093653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'default_template',
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
                    name: 'data',
                    type: 'longtext',
                    isNullable: false,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('default_template');
    }
}
