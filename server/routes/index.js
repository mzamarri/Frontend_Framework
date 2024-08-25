const express = require('express');
const catalogRouter = require('./catalogRouter');
const cartRouter = require('./cartRouter');
const orderHistoryRouter = require('./orderHistoryRouter');

const router = express.Router();

router.use('/', catalogRouter);
router.use('/cart', cartRouter);
router.use('/order-history', orderHistoryRouter);

module.exports = router;
