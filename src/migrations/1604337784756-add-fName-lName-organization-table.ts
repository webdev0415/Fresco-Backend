import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFNameLNameOrganizationTable1604337784756
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'organization',
            new TableColumn({
                name: 'lName',
                type: 'varchar',
                isNullable: false,
            }),
        );
        await queryRunner.addColumn(
            'organization',
            new TableColumn({
                name: 'fName',
                type: 'varchar',
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('organization', 'fName');
        await queryRunner.dropColumn('organization', 'lName');
    }
}
