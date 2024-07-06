const Catalog = require("../../server/Catalog");
const itemList = require("../../server/productList");
const queryDatabase = require("../../server/queryDatabase");

const deleteQuery = `DELETE FROM catalog`;
const setupTableQuery = `
    INSERT INTO catalog (catalog_id, name, price, image_src, description)
    VALUES ${itemList.map(item => {
        return `( '${item.catalogId}', '${item.name}', ${item.price}, '${item.imageSrc}', '${item.description}')`
    }).join(", ")}
    RETURNING *
`

beforeAll(() => console.log("itemList: ", itemList));

describe("Catalog Add Method", () => {
    beforeEach(async() => {
        await queryDatabase(deleteQuery)
        .then(() => console.log("Successfully deleted records from catalog"))
        .catch(err => console.error(err.stack));
    })

    test("Add to catalog", async () => {
        const catalog = new Catalog();
        await catalog.addToCatalog(itemList);

        const selectQuery = `SELECT * FROM catalog`;
        const res = await queryDatabase(selectQuery);

        const formattedResults = res.rows.map(row => ({
            catalogId: row.catalog_id,
            name: row.name,
            price: row.price,
            imageSrc: row.image_src,
            description: row.description
        }));

        itemList.forEach(item => {
            const result = formattedResults.find(result => result.catalogId === item.catalogId);
            expect(result).toMatchObject(item);
        });
    })
});

describe("Catalog Update Method", () => {
    beforeEach(async () => {
        await queryDatabase(deleteQuery);
        await queryDatabase(setupTableQuery)
        .then(res => console.log("catalog table: ", res.rows))
        .catch(err => console.error(err.stack));
    });

    test("Method parameters", async () => {
        const updatedItems = itemList.slice(0, 3).map(item => ({
            ...item,
            name: item.name + " Testing update method",
            imageSrc: "test",
            description: "Testing update method"
        }));

        const catalog = new Catalog();
        await catalog.updateCatalog(updatedItems);

        const selectQuery = `
            SELECT * FROM catalog
            WHERE catalog_id IN (${updatedItems.map(item => `'${item.catalogId}'`).join(", ")})
        `;
        const updatedResults = await queryDatabase(selectQuery);

        const updatedResultsFormatted = updatedResults.rows.map(row => ({
            catalogId: row.catalog_id,
            name: row.name,
            price: row.price,
            imageSrc: row.image_src,
            description: row.description
        }));

        updatedItems.forEach(item => {
            const updatedItem = updatedResultsFormatted.find(result => result.catalogId === item.catalogId);
            expect(updatedItem).toMatchObject(item);
        })
    });
})

describe("Catalog Remove Method", () => {
    beforeEach(async () => {
        await queryDatabase(deleteQuery);
        await queryDatabase(setupTableQuery)
        .then(res => console.log("catalog table: ", res.rows))
        .catch(err => console.error(err.stack));
    });
    test("Remove items from catalog", async () => {
        const catalog = new Catalog();
        const removedItems = itemList.slice(0, 3);
        await catalog.removeFromCatalog(removedItems);

        const selectQuery = `
            SELECT * FROM catalog
            WHERE catalog_id IN (${removedItems.map(item => `'${item.catalogId}'`).join(", ")})
        `;
        const removedResults = await queryDatabase(selectQuery);

        expect(removedResults.rows.length).toBe(0);
    });
});

describe("Catalog Get Method", () => {
    beforeEach(async() => {
        await queryDatabase(deleteQuery);
        await queryDatabase(setupTableQuery)
        .then(res => console.log("catalog table: ", res.rows))
        .catch(err => console.error(err.stack));
    });

    test("Get catalog", async () => {
        const catalog = new Catalog();
        const res = await catalog.getCatalog();

        const formattedResults = res.map(row => ({
            catalogId: row.catalog_id,
            name: row.name,
            price: row.price,
            imageSrc: row.image_src,
            description: row.description
        }));

        itemList.forEach(item => {
            const result = formattedResults.find(result => result.catalogId === item.catalogId);
            expect(result).toMatchObject(item);
        });
    });
});
