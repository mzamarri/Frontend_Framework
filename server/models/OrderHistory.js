const queryDatabase = require('../queryDatabase');

exports = module.exports = class {

    /*
    * Adds an order to the order history. The order object should have the following properties:
    * {
    *   orderId: string,
    *   date: string,
    *   totalPrice: float,
    *   items: [{ 
    *           name: string,
    *           price: float,
    *           imageSrc: string,
    *           description: string,
    *           amount: int
    *       },
    *       ...
    *   ]
    * }
    */

    async addToOrderHistory(order) {
        const query = `
            CALL add_to_order_history((
                ${order.totalPrice},
                ARRAY[${order.items.map(item => {
                    return `(${item.catalog_id}, ${item.amount})::item_amount`
                }).join(",")}]
                    )::order_info)
        `

        return await queryDatabase(query)
        .then(res => {
            console.log("Successfully added query...");
        })
        .catch(err => console.error(err));
    }

    async removeFromOrderHistory(order) {

    }

    async updateOrderHistory(order) {
        
    }

    async getOrderHistory(numOfRecords) {
        const query = `SELECT * FROM order_history LIMIT ${numOfRecords}`;
        return await queryDatabase(query)
        .then(res => {
            return res;
        })
        .catch(err => console.error(err));
    }
}