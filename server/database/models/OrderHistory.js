const queryDatabase = require('../queryDatabase');

exports = module.exports = class {
    static activeSessions = {}

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

    constructor(userId) {
        this.orders = [];
        this.userId = userId;
    }

    async addToOrderHistory(order) {
        const query = `
            CALL add_to_orders('${JSON.stringify(order)}');
        `

        return await queryDatabase(query)
        .then(() => {
            console.log("Successfully added order...");
        })
        .catch(err => console.error(err));
    }

    async removeFromOrderHistory(orderId) {

    }

    async updateOrderHistory(updatedOrder) {
        const query = `
            CALL update_order_history('${JSON.stringify(updatedOrder)}');
        `

        return await queryDatabase(query)
        .then(res => {
            console.log("Successfully updated database...");
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    async getOrderHistory(numOfRecords=15) {
        const query = `
            SELECT * FROM get_order_history(${numOfRecords});
        `;
        return await queryDatabase(query)
        .then(res => {
            console.log("Successfully queried order...")
            return res.rows;
        })
        .catch(err => console.error(err));
    }

    static newSession(sessionId) {
        this.activeSessions[sessionId] = new this(sessionId);
        return this.activeSessions[sessionId];
    }
}