import { isHotModule, requireContext } from '../shared.utils';

describe('SharedUtils', () => {
    describe('isHotModule', () => {
        it('should return true when module is hot', () => {
            expect(isHotModule({ hot: true } as any)).toBeTruthy();
        });
    });

    describe('requireContext', () => {
        it('should call context of require with given args', () => {
            const req = {
                context: jest.fn().mockReturnValue('return'),
            };

            expect(requireContext(req as any, 'hi', 'my', 'name', 'is')).toBe(
                'return',
            );
            expect(req.context).toBeCalledWith('hi', 'my', 'name', 'is');
        });
    });
});
