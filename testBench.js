const queryDatabase = require('./server/database/queryDatabase');
const { populateDatabaseCatalog, generateCatalog } = require('./server/database/test_utils/setupDatabaseCatalog');
const { populateDatabaseOrders, generateOrders } = require('./server/database/test_utils/setupDatabaseOrders');
const OrderHistory = require('./server/database/models/OrderHistory');
const Catalog = require('./server/database/models/Catalog');
const Cart = require('./server/database/models/Cart');

const isLogging = true

function logValue(value=20, log=false) {
    if (log) console.log("Value: ", value);
}

async function setupDatabase(catalongOnly=false) {
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

    const generatedCatalog = generateCatalog(20);
    const catalog = await populateDatabaseCatalog(generatedCatalog, true);
    if (catalongOnly) {
        const generatedOrders = generateOrders(catalog, 4, 6);
        const myOrders = [
            {
                address: "123 lions drive",
                totalPrice: 500.00,
                items: [
                    {
                        catalogId: 2,
                        amount: 7
                    },
                    {
                        catalogId: 4,
                        amount: 14
                    },
                    {
                        catalogId: 5,
                        amount: 21
                    },
                    {
                        catalogId: 6,
                        amount: 28
                    }
                ]
            }
        ]
        const orders = await populateDatabaseOrders(myOrders, true)
        .then(res => {
            console.log("Database successfully setup...");
            return res.rows;
        })
        .catch(err => {
            console.error("Error occured during database setup: ", err);
            throw err;
        });
    }
}

(async () => {
    const cart = new Cart();
    await cart.loadCartFromDatabase()
})()


