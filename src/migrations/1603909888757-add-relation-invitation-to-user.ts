import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
export class AddRelationInvitationToUser1603909888757
    implements MigrationInterface {
    // private _fromUserIdToUserForeignKey = new TableForeignKey({
    //     name: 'fk_fromUserId_user',
    //     columnNames: ['fromUserId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'user',
    // });
    // private _toUserIdToUserForeignKey = new TableForeignKey({
    //     name: 'fk_toUserId_user',
    //     columnNames: ['toUserId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'user',
    // });
    private _orgIdToOrganizationsForeignKey = new TableForeignKey({
        name: 'fk_orgId_org',
        columnNames: ['orgId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organization',
    });
    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.createForeignKey(
        //     'invitation',
        //     this._fromUserIdToUserForeignKey,
        // );
        // await queryRunner.createForeignKey(
        //     'invitation',
        //     this._toUserIdToUserForeignKey,
        // );
        await queryRunner.createForeignKey(
            'invitation',
            this._orgIdToOrganizationsForeignKey,
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.dropForeignKey(
        //     'invitation',
        //     this._fromUserIdToUserForeignKey,
        // );
        // await queryRunner.dropForeignKey(
        //     'invitation',
        //     this._toUserIdToUserForeignKey,
        // );
        await queryRunner.dropForeignKey(
            'invitation',
            this._orgIdToOrganizationsForeignKey,
        );
    }
}
