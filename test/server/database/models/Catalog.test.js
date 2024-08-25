const Catalog = require('../../../../server/database/models/Catalog');
const queryDatabase = require("../../../../server/database/queryDatabase");
const { setupDatabaseTables } = require('../../../../server/database/test_utils/utils');
const { setupDatabaseCatalog } = require('../../../../server/database/test_utils/setupDatabaseCatalog');

let catalogList;

beforeAll(async () => {
    await setupDatabaseCatalog()
    .then(() => console.log("Successfully setup Database..."))
    .catch(err => console.error(err));
    
    const getCatalogQuery = `
        SELECT * FROM get_catalog();
    `
    const res = await queryDatabase(getCatalogQuery);
    catalogList = res.rows;
});

beforeEach(async () => {
    await setupDatabaseTables();
})

describe("Catalog Add Method", () => {
    test("Add to catalog", async () => {
        const catalog = new Catalog();
        await catalog.addToCatalog(catalogList);

        const selectQuery = `SELECT * FROM get_catalog();`;
        const res = await queryDatabase(selectQuery);
        const catalogResults = res.rows;

        expect(catalogResults).toMatchObject(catalogList);
    })
});

describe("Catalog Update Method", () => {
    beforeEach(async () => {
        await setupDatabaseCatalog()
        .then(() => console.log("Successfully setup Database..."))
        .catch(err => {
            console.error("Failed setting up databaseCatalog");
            throw err;
        });
    });

    test("Update first 3 catalog items", async () => {
        // First 3 catalog items will be updated
        const updatedItems = [...catalogList].slice(0, 3).map(item => ({
            ...item,
            name: "Testing update method for " + item.name,
            imageSrc: "Test",
            description: "Testing update method"
        }));

        const catalog = new Catalog();
        await catalog.updateCatalog(updatedItems);

        const selectQuery = `
            SELECT * FROM get_catalog()
            WHERE "catalogId" IN (${updatedItems.map(item => `${item.catalogId}`).join(", ")});
        `;
        const updatedResults = await queryDatabase(selectQuery);
        const updatedCatalogItems = updatedResults.rows;

        expect(updatedCatalogItems).toMatchObject(updatedItems);
    });
})

describe("Catalog Remove Method", () => {
    beforeEach(async () => {
        await setupDatabaseCatalog()
        .then(() => console.log("Successfully setup Database..."))
        .catch(err => console.error(err));
    });
    test.skip("Remove first 3 items from catalog", async () => {
        // Removing first 3 items from catalogList
        const removedItems = [...catalogList].slice(0, 3);
        const catalog = new Catalog();
        await catalog.removeFromCatalog(removedItems);

        const selectQuery = `
            SELECT * FROM catalog
            WHERE catalog_id IN (${removedItems.map(item => `${item.catalogId}`).join(", ")})
        `;
        const removedResults = await queryDatabase(selectQuery);

        expect(removedResults.rows.length).toBe(0);
    });
});

describe("Catalog Get Method", () => {
    beforeEach(async() => {
        await setupDatabaseTables();
        await setupDatabaseCatalog()
        .then(() => console.log("Successfully setup Database..."))
        .catch(err => console.error(err));
    });

    test("Get catalog", async () => {
        const catalog = new Catalog();
        const catalogListFromDB = await catalog.getCatalog();

        expect(catalogListFromDB).toMatchObject(catalogList);
    });
});
