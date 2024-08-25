const OrderHistory = require('../../../../server/database/models/OrderHistory');
const Catalog = require('../../../../server/database/models/Catalog');
const { generateCatalog, populateDatabaseCatalog, setupDatabaseCatalog } = require('../../../../server/database/test_utils/setupDatabaseCatalog');
const { generateOrders, createOrder, populateDatabaseOrders } = require('../../../../server/database/test_utils/setupDatabaseOrders');
const { setupDatabaseTables } = require('../../../../server/database/test_utils/utils');
const queryDatabase = require('../../../../server/database/queryDatabase');

let orders, catalogList;

beforeAll(async () => {
    await setupDatabaseTables();
    const generatedCatalogList = generateCatalog(30);
    catalogList = await populateDatabaseCatalog(generatedCatalogList, true);

    orders = generateOrders([...catalogList].splice(0, Math.round(catalogList.length/2)), 8, 5);
});

let orderHistory, catalog;

beforeEach(async () => {
    await setupDatabaseTables();
    await populateDatabaseCatalog(catalogList);

    orderHistory = new OrderHistory();
    catalog = new Catalog();
})

describe("Order History Add method", () => {
    test("Add to Order History", async () => {
        for (const order of orders) {
            await orderHistory.addToOrderHistory(order);
        }

        const query = `
            SELECT * FROM get_order_history();
        `
        const orderList = await queryDatabase(query)
        .then(res => {
            console.log("queried successfully...");
            return res.rows;
        })
        .catch(err => {
            console.error("Error getting order history");
            throw err;
        });

        expect(orderList).toMatchObject(orders);
    })
});

describe("Order History Get method", () => {
    test("Getting Order History", async () => {
        const databaseOrders = await populateDatabaseOrders(orders, true);
        const classOrders = await orderHistory.getOrderHistory();

        expect(databaseOrders).toMatchObject(classOrders);
    })
});

describe("Order History Update method", () => {
    let orderHistoryRecords, updatedOrders; 
    beforeEach(async () => {
        orderHistoryRecords = await populateDatabaseOrders(orders, true);
        updatedOrders = [...orderHistoryRecords].splice(0, 3);
    });

    test("Test adding items to an existing order", async () => {
        expectedOrders = updatedOrders.map((order, index) => ({
                ...order,
                address: "New Address",
                totalPrice: 123.456,
                updatedItems: {
                    add: [
                        {
                            catalogId: 16 + 3*index,
                            amount: 100
                        },
                        {
                            catalogId: 17 + 3*index,
                            amount: 200
                        },
                        {
                            catalogId: 18 + 3*index,
                            amount: 300
                        }   
                    ]
                },
                items: order.items.concat(
                    [
                        {
                            ...catalogList[15 + 3*index],
                            amount: 100
                        },
                        {
                            ...catalogList[16 + 3*index],
                            amount: 200
                        },
                        {
                            ...catalogList[17 + 3*index],
                            amount: 300
                        }
                    ]
                )
            }))
        for (const order of expectedOrders) {
            await orderHistory.updateOrderHistory(order);
        }

        const orderIds = expectedOrders.map(o => o.orderId);
        const query = `
            SELECT * FROM get_order_history() WHERE "orderId" IN (${orderIds})
        `

        const databaseOrderHistory = await queryDatabase(query)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error: ", err);
            throw err;
        })

        expect(expectedOrders).toMatchObject(databaseOrderHistory);
    })

    test("Test updating items to an existing order", async () => {
        expectedOrders = updatedOrders.map((order) => ({
            ...order,
            address: "New Address",
            totalPrice: 123.456,
            updatedItems: {
                update: order.items.map(orderItem => ({
                    ...orderItem,
                    amount: 0
                }))
            },
            items: order.items.map(orderItem => ({
                ...orderItem,
                amount: 0
            }))
        }))
        for (const order of expectedOrders) {
            await orderHistory.updateOrderHistory(order);
        }

        const orderIds = expectedOrders.map(o => o.orderId);
        const query = `
            SELECT * FROM get_order_history() WHERE "orderId" IN (${orderIds})
        `

        const databaseOrderHistory = await queryDatabase(query)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error: ", err);
            throw err;
        })

        expect(expectedOrders).toMatchObject(databaseOrderHistory);
    })

    test("Test remove items to an existing order", async () => {
        expectedOrders = updatedOrders.map(order => {
            let tempItems = order.items.splice(0,3);
            const newOrder = {
                ...order,
                address: "New Address",
                totalPrice: 123.456,
                updatedItems: {
                    remove: tempItems.map(orderItem => ({
                        ...orderItem,
                        catalogId: orderItem.catalogId
                    }))
                }
            }
            return newOrder;
        })
        for (const order of expectedOrders) {
            await orderHistory.updateOrderHistory(order);
        }

        const orderIds = expectedOrders.map(o => o.orderId);
        const query = `
            SELECT * FROM get_order_history() WHERE "orderId" IN (${orderIds})
        `

        const databaseOrderHistory = await queryDatabase(query)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error: ", err);
            throw err;
        })

        expect(expectedOrders).toMatchObject(databaseOrderHistory);
    })
});