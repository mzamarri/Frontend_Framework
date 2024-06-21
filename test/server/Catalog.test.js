const Catalog = require("../../server/Catalog");
const { Pool, Client } = require("pg");
const itemList = require("../../server/productList");
const queryDatabase = require("../../server/queryDatabase");
require("dotenv").config();

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
}

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
            price: 100.00,
            imageSrc: "test",
            description: "Testing update method"
        }));

        const selectQuery = `SELECT * FROM catalog`;
        const expectedResults = await queryDatabase(selectQuery); 
    
        const testQuery = `UPDATE catalog SET name=${itemList.name}`
        const result = await client.query(query);
    
        const catalog = new Catalog();
        const resCatalog = await catalog.updateCatalog(itemList);
    
    });
})
