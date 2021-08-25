import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UsersOrgsTable1603907586547 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'user_org',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isNullable: false,
                    length: '36',
                },
                {
                    name: 'userId',
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
                    name: 'permission',
                    type: 'enum',
                    enum: ['admin', 'editor', 'view'],
                    enumName: 'permissionEnum',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_org');
    }
}
