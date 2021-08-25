import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationImageToCategory1605455192711
    implements MigrationInterface {
    private _categoryToImageForeignKey = new TableForeignKey({
        name: 'fk_category_image',
        columnNames: ['imageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'image',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'category',
            this._categoryToImageForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'category',
            this._categoryToImageForeignKey,
        );
    }
}
