import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class SddInvitationTypeLinkForeignKey1605640524821
    implements MigrationInterface {
    private _invitationTypeLinkToOrganizationForeignKey = new TableForeignKey({
        name: 'fk_invitationTypeLink_organization',
        columnNames: ['orgId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organization',
    });

    private _invitationTypeLinkToUser = new TableForeignKey({
        name: 'fk_invitationTypeLink_user',
        columnNames: ['createdUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'invitation_type_link',
            this._invitationTypeLinkToOrganizationForeignKey,
        );
        await queryRunner.createForeignKey(
            'invitation_type_link',
            this._invitationTypeLinkToUser,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'invitation_type_link',
            this._invitationTypeLinkToOrganizationForeignKey,
        );
        await queryRunner.dropForeignKey(
            'invitation_type_link',
            this._invitationTypeLinkToUser,
        );
    }
}
