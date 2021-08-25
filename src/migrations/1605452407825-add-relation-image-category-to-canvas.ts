import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationImageCategoryToCanvas1605452407825
    implements MigrationInterface {
    private _canvasToImageForeignKey = new TableForeignKey({
        name: 'fk_canvas_image',
        columnNames: ['imageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'image',
    });

    private _canvasToCategoryForeignKey = new TableForeignKey({
        name: 'fk_canvas_category',
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'canvas',
            this._canvasToImageForeignKey,
        );
        await queryRunner.createForeignKey(
            'canvas',
            this._canvasToCategoryForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'canvas',
            this._canvasToImageForeignKey,
        );
        await queryRunner.dropForeignKey(
            'canvas',
            this._canvasToCategoryForeignKey,
        );
    }
}
