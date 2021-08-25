import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddInvitationTypeLinkUserForeignKey1605639646544
    implements MigrationInterface {
    private _invitationTypeLinkUserToInvitaionTypeLinkForeignKey = new TableForeignKey(
        {
            name: 'fk_invitationTypeLinkUser_invitationTypeLink',
            columnNames: ['invitationTypeLinkId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'invitation_type_link',
        },
    );

    private _invitationTypeLinkUserToUser = new TableForeignKey({
        name: 'fk_invitationTypeLinkUser_user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'invitation_type_link_user',
            this._invitationTypeLinkUserToInvitaionTypeLinkForeignKey,
        );
        await queryRunner.createForeignKey(
            'invitation_type_link_user',
            this._invitationTypeLinkUserToUser,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'invitation_type_link_user',
            this._invitationTypeLinkUserToInvitaionTypeLinkForeignKey,
        );
        await queryRunner.dropForeignKey(
            'invitation_type_link_user',
            this._invitationTypeLinkUserToUser,
        );
    }
}
