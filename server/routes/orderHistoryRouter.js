const express = require('express');

const router = express.Router();

router.get("/get-orders", (req, res) => {
    console.log("Order History endpoint reached...");
    const orders = 
    res.json("reached order history endpoint...");
})

module.exports = router;