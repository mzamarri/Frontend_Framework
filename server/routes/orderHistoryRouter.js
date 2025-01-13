const express = require('express');

const router = express.Router();

router.use(express.json());

router.get("/get-orders", async (req, res) => {
    console.log("Order History endpoint reached...");
    const orders = await req.session.orderHistory.getOrderHistory();
    res.json(orders);
})

router.post("/submit-order", async (req, res) => {
    const order = req.body;

    await req.session.orderHistory.submitOrder(order)
        .then(() => console.log("Order submitted successfully "))
        .catch(err => console.error(err));
    res.json("Thank you for the purchase!");
});

module.exports = router;