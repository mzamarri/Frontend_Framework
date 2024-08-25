const queryDatabase = require('../../../../server/database/queryDatabase');
const setupDatabaseCatalog = require('../../../../server/database/test_utils/setupDatabaseCatalog');
const { randomInt } = require('../../../../server/database/test_utils/utils')

describe("Test populateDatabaseCatalog() with different sized arrays of items", () => {
    let testCases = []
    for (let i = 0; i < 10; i++) {
        testCases.push(randomInt(40));
    }

    test.each(testCases)("Should generate a catalog with %i items", async arraySize => {
        const catalogList = setupDatabaseCatalog.generateCatalog(arraySize);

        const fnCatalogList = await setupDatabaseCatalog.populateDatabaseCatalog(catalogList, returnCatalog=true)
        .then(res => {
            console.log("Successfully populated database values for catalog");
            return res;
        })
        .catch(err => {
            console.error("Error executing populateDatabaseCatalog(): ", err);
            throw err;
        });

        const selectQuery = `
            SELECT * FROM get_catalog();
        `
        const res = await queryDatabase(selectQuery);
        const queryCatalogList = res.rows;

        expect(queryCatalogList).toMatchObject(catalogList);
        expect(queryCatalogList).toMatchObject(fnCatalogList);
    })
})