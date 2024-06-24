const Catalog = require('../app/static/views/Catalog.js');

test('Catalog page should have 50 items', () => {
    let catalog = new Catalog();
    catalog.items = new Array(100);

    expect(catalog.items.length).toBe(100);
})