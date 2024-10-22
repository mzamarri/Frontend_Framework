const express = require('express');

const router = express.Router();

router.get("/get-orders", async (req, res) => {
    console.log("Order History endpoint reached...");
    const orders = await req.session.orderHistory.getOrderHistory();
    res.json(orders);
})

module.exports = router;