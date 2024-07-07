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
        
    }

    async removeFromOrderHistory(order) {

    }

    async updateOrderHistory(order) {

    }

    async getOrderHistory() {
        const query = `SELECT * FROM order_history`;
        return await queryDatabase(query)
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.error(err));
    }
}