import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ImageTable1605118370486 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'image',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '225',
                    isNullable: false,
                },
                {
                    name: 'path',
                    type: 'varchar',
                    length: '225',
                    isNullable: false,
                },
                {
                    name: 'deleted',
                    type: 'boolean',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: true,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('image');
    }
}
