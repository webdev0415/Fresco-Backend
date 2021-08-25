import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InvitationTable1603909179164 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'invitation',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'fromUserId',
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
                    name: 'toUserId',
                    type: 'varchar',
                    length: '36',
                    isNullable: true,
                },
                {
                    name: 'toEmail',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'token',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'verified',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
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
        await queryRunner.dropTable('invitation');
    }
}
