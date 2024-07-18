const OrderHistory = require('./server/models/OrderHistory');
const Catalog = require('./server/models/Catalog');
const catalogItems = require('./server/productList');
const databaseSetup = require('./test/databaseSetup');

const orderHistory = new OrderHistory();
const catalog = new Catalog();

(async () => {
    // console.time("testBench");
    // await catalog.addToCatalog(catalogItems);
    // const orders = await require('./server/orderHistoryList');
    // // console.log("orders: ", orders);
    // for (const order of orders) {
    //     // console.log("order: ", order);
    //     await orderHistory.addToOrderHistory(order);
    // }
    // // console.log("Order History: ", (await orderHistory.getOrderHistory(10)).rows);
    // console.timeEnd("testBench");
    await databaseSetup();
})()
