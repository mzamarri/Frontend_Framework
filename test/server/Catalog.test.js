const Catalog = require("../../server/Catalog");
const itemList = require("../../server/productList");
const queryDatabase = require("../../server/queryDatabase");

describe("Catalog Update Method", () => {
    const deleteQuery = `DELETE FROM catalog`;
    const setupTableQuery = `
        INSERT INTO catalog (catalog_id, name, price, image_src, description)
        VALUES ${itemList.map(item => {
            `( '${item.catalogId}', '${item.name}', ${item.price}, '${item.imageSrc}', '${item.description})`
        }).join(", ")}
    `

    beforeAll(() => console.log("itemList: ", itemList));

    beforeEach(async () => {
        await queryDatabase(deleteQuery);
        await queryDatabase(setupTableQuery)
        .then(res => console.log("catalog table: ", res.rows))
        .catch(err => console.error(err.stack));
    });

    test("Method parameters", async () => {
        const updatedItems = itemList.slice(0, 3).map(item => ({
            ...item,
            name: item.name + "Testing update method",
            price: 100.00 * 1.1,
            imageSrc: "test",
            description: "Testing update method"
        }));

        const selectQuery = `
            SELECT * FROM catalog
            WHERE catalog_id IN (${updatedItems.map(item => `'${item.catalogId}'`).join(", ")})
        `;
        const updatedResults = await queryDatabase(selectQuery);
        
        const updatedResultsFormatted = initialResults.rows.map(row => ({
            catalogId: row.catalog_id,
            name: row.name,
            price: row.price,
            imageSrc: row.image_src,
            description: row.description
        }));
    
        const testQuery = `UPDATE catalog SET name=${itemList.name}`
        const result = await client.query(query);
    
        const catalog = new Catalog();
        const resCatalog = await catalog.updateCatalog(itemList);
    
    });
})
