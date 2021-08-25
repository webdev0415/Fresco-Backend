import {AbstractDto} from '../AbstractDto';

describe('AbstractDto', () => {
    it('AbstractDto snapshot ', () => {
        expect(AbstractDto).toMatchSnapshot();
    });
});
