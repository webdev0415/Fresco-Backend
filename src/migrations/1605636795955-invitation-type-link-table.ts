import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InvitationTypeLinkTable1605636795955
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'invitation_type_link',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'token',
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
                    isNullable: false,
                },
                {
                    name: 'permission',
                    type: 'enum',
                    enum: ['creator', 'admin', 'editor', 'view'],
                    enumName: 'permissionEnum',
                    isNullable: false,
                },
                {
                    name: 'numberOfUser',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: ['canvas', 'board'],
                    enumName: 'typeEnum',
                    isNullable: false,
                },
                {
                    name: 'typeId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'isDeleted',
                    type: 'tinyInt',
                    isNullable: false,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('invitation_type_link');
    }
}
