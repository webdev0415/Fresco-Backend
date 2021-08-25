import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRelationImageCategoryToBoard1605455094979
    implements MigrationInterface {
    private _boardToImageForeignKey = new TableForeignKey({
        name: 'fk_board_image',
        columnNames: ['imageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'image',
    });

    private _boardToCategoryForeignKey = new TableForeignKey({
        name: 'fk_board_category',
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'board',
            this._boardToImageForeignKey,
        );
        await queryRunner.createForeignKey(
            'board',
            this._boardToCategoryForeignKey,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('board', this._boardToImageForeignKey);
        await queryRunner.dropForeignKey(
            'board',
            this._boardToCategoryForeignKey,
        );
    }
}
