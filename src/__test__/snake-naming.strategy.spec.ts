import { SnakeNamingStrategy } from '../snake-naming.strategy';

describe('SnakeNamingStrategy', () => {
    const snakeNamingStrategy = new SnakeNamingStrategy();
    describe('SnakeNamingStrategy tableName', () => {
        it('SnakeNamingStrategy tableName with customName', () => {
            expect(
                snakeNamingStrategy.tableName('exampleTable', 'exampleTable'),
            ).toEqual('exampleTable');
        });
        it('SnakeNamingStrategy tableName without customName', () => {
            expect(snakeNamingStrategy.tableName('exampleTable', '')).toEqual(
                'example_table',
            );
        });
    });
    describe('SnakeNamingStrategy columnName', () => {
        it('SnakeNamingStrategy columnName with customName', () => {
            expect(
                snakeNamingStrategy.columnName('example', 'example', [
                    'example',
                    'prefix',
                ]),
            ).toEqual('example_prefixexample');
        });
        it('SnakeNamingStrategy columnName without customName', () => {
            expect(
                snakeNamingStrategy.columnName('example', '', [
                    'example',
                    'prefix',
                ]),
            ).toEqual('example_prefixexample');
        });
    });
    describe('SnakeNamingStrategy relationName', () => {
        it('pascal relationName to be converted in snake case', () => {
            expect(snakeNamingStrategy.relationName('ExampleTable')).toEqual(
                'example_table',
            );
        });
        it('camel relationName to be converted in snake case', () => {
            expect(snakeNamingStrategy.relationName('exampleTable')).toEqual(
                'example_table',
            );
        });
    });
    describe('SnakeNamingStrategy joinColumnName', () => {
        it('joinColumnName with relation name', () => {
            expect(
                snakeNamingStrategy.joinColumnName(
                    'exampleRelation',
                    'exampleColumn',
                ),
            ).toEqual('example_relation_example_column');
        });
    });
    describe('SnakeNamingStrategy joinTableName', () => {
        it('joinTableName with join the two different columns of two different tables', () => {
            expect(
                snakeNamingStrategy.joinTableName(
                    'exampleTable1',
                    'exampleColumn1',
                    'exampleTable2',
                    'exampleColumn2',
                ),
            ).toEqual('example_table1_example_table2_example_column1');
        });
    });

    describe('SnakeNamingStrategy joinTableColumnName', () => {
        it('joinTableColumnName with relation name', () => {
            expect(
                snakeNamingStrategy.joinTableColumnName(
                    'exampleTable',
                    'exampleProperty',
                    'exampleColumn',
                ),
            ).toEqual('example_table_example_column');
        });
        it('joinTableColumnName with relation name without column', () => {
            expect(
                snakeNamingStrategy.joinTableColumnName(
                    'exampleTable',
                    'exampleProperty',
                    '',
                ),
            ).toEqual('example_table_example_property');
        });
    });
    describe('SnakeNamingStrategy classTableInheritanceParentColumnName', () => {
        it('joinTableColumnName join parentTableName and parentTableIdPropertyName with _ ', () => {
            expect(
                snakeNamingStrategy.classTableInheritanceParentColumnName(
                    'parentTableName',
                    'parentTableIdPropertyName',
                ),
            ).toEqual('parent_table_name_parent_table_id_property_name');
        });
    });
});
