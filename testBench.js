const queryDatabase = require('./server/database/queryDatabase');
const { populateDatabaseCatalog, generateCatalog } = require('./server/database/test_utils/setupDatabaseCatalog');
const { populateDatabaseOrders, generateOrders } = require('./server/database/test_utils/setupDatabaseOrders');
const OrderHistory = require('./server/database/models/OrderHistory')

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

    await setupDatabase(true);
    const ordersHistory = new OrderHistory();

    const getOrderHistoryQuery = `
        SELECT * FROM get_order_history();
    `

    const results = await queryDatabase(getOrderHistoryQuery);
    console.log("results: \n", results.rows);

    // const updatedObject = {
    //     orderId: 1,
    //     address: "New address",
    //     totalPrice: 1000000,
    //     items: {
    //         add: [
    //             {
    //                 catalogId: 1,
    //                 amount: 5
    //             },
    //             {
    //                 catalogId: 3,
    //                 amount: 10
    //             },
    //             {
    //                 catalogId: 7,
    //                 amount: 15
    //             }
    //         ],
    //         remove: [
    //             {
    //                 catalogId: 4
    //             },
    //             {
    //                 catalogId: 5
    //             },
    //             {
    //                 catalogId: 6
    //             }
    //         ],
    //         update: [
    //             {
    //                 catalogId: 1,
    //                 amount: 20
    //             },
    //             {
    //                 catalogId: 2,
    //                 amount: 25
    //             },
    //             {
    //                 catalogId: 3,
    //                 amount: 30
    //             }
    //         ]
    //     }
    // }

    // ordersHistory.updateOrderHistory(updatedObject);

    const newOrder = {
        address: "619 Avenue",
        totalPrice: 999.99,
        items: [
            {
                catalogId: 5,
                amount: 11
            },
            {
                catalogId: 7,
                amount: 22
            },
            {
                catalogId: 11,
                amount: 33
            },
        ]
    }

    ordersHistory.addToOrderHistory(newOrder);
    const updatedResults = await queryDatabase(getOrderHistoryQuery);
    console.log("updated results: \n", updatedResults.rows);
})()


