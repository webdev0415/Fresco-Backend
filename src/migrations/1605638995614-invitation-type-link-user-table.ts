import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InvitationTypeLinkUserTable1605638995614
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'invitation_type_link_user',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: true,
                    length: '36',
                },
                {
                    name: 'invitationTypeLinkId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'userId',
                    type: 'varchar',
                    length: '36',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('invitation_type_link_user');
    }
}
