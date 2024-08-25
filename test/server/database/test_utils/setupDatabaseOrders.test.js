const queryDatabase = require('../../../../server/database/queryDatabase');
const { populateDatabaseOrders, generateOrders } = require('../../../../server/database/test_utils/setupDatabaseOrders');
const { populateDatabaseCatalog, generateCatalog } = require('../../../../server/database/test_utils/setupDatabaseCatalog');
const { randomInt } = require('../../../../server/database/test_utils/utils')

describe("Test populateDatabaseOrders() with different sized orders", () => {
    let testCases = []
    for (let i = 0; i < 10; i++) {
        testCases.push([randomInt(10, 1), 5]);
    }

    let catalogList;
    beforeEach(async () => {
        const setupQuery = `
            CALL clear_tables();
            CALL create_tables();
        `

        await queryDatabase(setupQuery);

        // Setup database catalog
        const generatedCatalogList = generateCatalog(30);
        catalogList = await populateDatabaseCatalog(generatedCatalogList, returnCatalog=true);
    })

    test.each(testCases)("Should match generated orders with %i orders", async (numOfOrders, numOfItems) => {
        const generatedOrders = generateOrders(catalogList, numOfOrders, numOfItems);
        const fnOrders = await populateDatabaseOrders(generatedOrders, returnOrders=true);

        const getQuery = `
            SELECT * FROM get_order_history();
        `
        const orders = await queryDatabase(getQuery)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error getting order_history: ", err);
            throw err;
        });

        expect(orders).toMatchObject(generatedOrders);
        expect(orders).toMatchObject(fnOrders);
    });
})