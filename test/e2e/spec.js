describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('localhost:3000');

        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});