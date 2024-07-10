const Catalog = require("./models/Catalog");

const catalog = new Catalog();

function randomInt(max, min=0) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createOrder(totalPrice, items, maxAmount, numOfItems) {
    let orderItems = [];
    const tempList = [...items];
    for (let i = 0; i < numOfItems; i++) {
        const index = randomInt(tempList.length);
        orderItems.push({
                ...tempList[index],
                amount: randomInt(min=1, maxAmount)
        });
        tempList.splice(index, 1);
    }
    return {
        totalPrice: totalPrice,
        items: orderItems
    };
}

const orders = (async () => {
    const numItems = 5;
    const numOfOrders = 8;
    let tempOrders = [];
    const catalog_list = await catalog.getCatalog();
    // console.log("catalog list: ", catalog_list);
    for (let i = 0; i < numOfOrders; i++) {
        tempOrders.push(createOrder(40.25 * i, catalog_list, 8, numItems));
    }
    return tempOrders;
})()

exports = module.exports = orders;