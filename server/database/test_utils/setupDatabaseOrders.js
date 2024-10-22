const queryDatabase = require('../queryDatabase');
const { randomInt } = require('./utils');

function createOrder(userId, address, totalPrice, items, maxAmount, numOfItems) {
    let orderItems = [];
    const tempList = [...items];
    for (let i = 0; i < numOfItems; i++) {
        const index = randomInt(tempList.length);
        orderItems.push({
                catalogId: tempList[index].catalogId,
                amount: randomInt(min=1, maxAmount)
        });
        tempList.splice(index, 1);
    }
    orderItems.sort((a, b) => a.catalogId - b.catalogId);
    return {
        userId: userId,
        address: address,
        totalPrice: totalPrice,
        items: orderItems
    };
}

// Catalog table needs to be populated, otherwise orders array will not be generated
const generateOrders = (catalogList, numOfOrders, numOfItems) => {
    let tempOrders = [];
    const address = [
        "123 street",
        "456 boulevard",
        "789 avenue"
    ];
    const userIds = [
        "mike50zam",
        "snipey mike",
        "migwee"
    ];
    for (let i = 0; i < numOfOrders; i++) {
        tempOrders.push(createOrder(userIds[i % 3], address[i % 3], 40.25 * i, catalogList, 8, numOfItems));
    }
    return tempOrders;
}

const populateDatabaseOrders = async (orders, returnOrders=false) => {
    // Setting up order data
    for (const order of orders) {
        const postQuery = `
            CALL add_to_orders('${JSON.stringify(order)}');
        `
        await queryDatabase(postQuery);
    }
    console.log("Successfully setup orders...")
    if (returnOrders) {
        const getQuery = `
            SELECT * FROM get_order_history();
        `

        return await queryDatabase(getQuery)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error getting orders from database: ", err);
            throw err;
        })
    }
}

module.exports = { generateOrders, createOrder, populateDatabaseOrders }