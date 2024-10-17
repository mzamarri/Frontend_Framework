const express = require('express');
const catalogRouter = require('./catalogRouter');
const cartRouter = require('./cartRouter');
const orderHistoryRouter = require('./orderHistoryRouter');
const Cart = require('../database/models/Cart');
const OrderHistory = require("../database/models/OrderHistory");

const router = express.Router();

router.use(["/catalog", "/cart"], express.json(), (req, res, next) => {
    const sessionId = req.session.id;
    
    req.session.cart = sessionId in Cart.sessionCarts 
        ? Cart.sessionCarts[sessionId] 
        : Cart.newSession(sessionId);    
    next();
});

router.use("order-history", (req, res, next) => {
    const sessionId = req.session.id;

    req.session.orderHistory = sessionId in OrderHistory.activeSessions
        ? OrderHistory.activeSessions[sessionId]
        : OrderHistory.newSession(sessionId);
        next(); 
})

router.use('/catalog', catalogRouter);
router.use('/cart', cartRouter);
router.use('/order-history', orderHistoryRouter);

module.exports = router;
