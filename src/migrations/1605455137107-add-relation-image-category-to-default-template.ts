import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationImageCategoryToDefaultTemplate1605455137107
    implements MigrationInterface {
    private _defaultTemplateToImageForeignKey = new TableForeignKey({
        name: 'fk_defaultTemplate_image',
        columnNames: ['imageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'image',
    });

    private _defaultTemplateToCategoryForeignKey = new TableForeignKey({
        name: 'fk_defaultTemplate_category',
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'default_template',
            this._defaultTemplateToImageForeignKey,
        );
        await queryRunner.createForeignKey(
            'default_template',
            this._defaultTemplateToCategoryForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'default_template',
            this._defaultTemplateToImageForeignKey,
        );
        await queryRunner.dropForeignKey(
            'default_template',
            this._defaultTemplateToCategoryForeignKey,
        );
    }
}
