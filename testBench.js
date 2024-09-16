const queryDatabase = require('./server/database/queryDatabase');
const { populateDatabaseCatalog, generateCatalog } = require('./server/database/test_utils/setupDatabaseCatalog');
const { populateDatabaseOrders, generateOrders } = require('./server/database/test_utils/setupDatabaseOrders');
const OrderHistory = require('./server/database/models/OrderHistory');
const Catalog = require('./server/database/models/Catalog');
const Cart = require('./server/database/models/Cart');

async function setupDatabase(catalogOnly=false) {
    const setupTablesQuery = `
        CALL clear_tables();
        CALL create_tables();
    ` 

    await queryDatabase(setupTablesQuery)
    .then(res => console.log("Database tables setup..."))
    .catch(err => {
        console.error("Error creating tables");
        throw err;
    });

    const generatedCatalog = generateCatalog(60);
    const catalog = await populateDatabaseCatalog(generatedCatalog, true)
    .then(res => {
        console.log("Catalog successfully setup");
        return res;
    })
    .catch(err => {
        console.error(err);
        throw err;
    });
    if (!catalogOnly) {
        const generatedOrders = generateOrders(catalog, 8, 6);
        return await populateDatabaseOrders(generatedOrders, true)
        .then(res => {
            console.log("Database successfully setup...");
            return res;
        })
        .catch(err => {
            console.error("Error occured during database setup: ", err);
            throw err;
        });
    }
}

(async () => {
    const orders = await setupDatabase();
    console.log("orders: ", orders);
})()


