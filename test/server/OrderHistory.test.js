const OrderHistory = require('../../server/models/OrderHistory');
const Catalog = require('../../server/models/Catalog');
const catalogItems = require('../../server/productList');

describe("Order History add method", () => {
    let orderHistory, catalog;
    beforeEach(() => {
        orderHistory = new OrderHistory();
        catalog = new Catalog();
    })

    test("Add to Order History", async () => {
        console.time("Adding to Order History");
        await catalog.addToCatalog(catalogItems);
        const orders = await require('../../server/orderHistoryList');
        // console.log("orders: ", orders);
        for (const order of orders) {
            // console.log("order: ", order);
            await orderHistory.addToOrderHistory(order);
        }
        // console.log("Order History: ", (await orderHistory.getOrderHistory(10)).rows);
        console.timeEnd("Adding to Order History");
    })
});

describe("Order History Get method", () => {
    
})