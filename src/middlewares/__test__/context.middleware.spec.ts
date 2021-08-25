describe('contextMiddleware', () => {
    it('should create request middleware', async () => {
        const { contextMiddleware } = await import('../index');

        expect(contextMiddleware).toBeInstanceOf(Function);
    });
});
