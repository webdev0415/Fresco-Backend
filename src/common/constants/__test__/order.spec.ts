import {Order} from '../order';

describe('Order', () => {
    it('Order snapshot ', () => {
        expect(Order).toMatchSnapshot();
    });
});
