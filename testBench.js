const queryDatabase = require('./server/queryDatabase.js');
const OrderHistory = require('./server/models/OrderHistory.js')

const query = `SELECT * FROM order_history`;
const orderHistory = new OrderHistory();

(async () => {
    const res = await orderHistory.getOrderHistory();
    console.log(res.row);
    res.rows.forEach(item => console.log(item));
})()