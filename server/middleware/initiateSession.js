const Cart = require("../database/models/Cart");
const OrderHistory = require("../database/models/OrderHistory");

module.exports = function (req, res, next) {
    const sessionId = req.session.id;

    if (!(sessionId in Cart.sessionCarts)) Cart.newSession(sessionId); 
    if (!(sessionId in OrderHistory.activeSessions)) OrderHistory.newSession(sessionId);
    next();
}