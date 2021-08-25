import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Messages1606817488153 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'messages',
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
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'senderId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'message',
                    type: 'longtext',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('messages');
    }
}
