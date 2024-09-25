const express = require('express');
const router = express.Router();

router.use(async (req, res, next) => {
    await req.session.cart.loadCartFromDatabase();
    next();
});

router.get(["/", "/get-cart"], (req, res) => {
    const cartItems = req.session.cart.getCart();

    res.json(cartItems);
});
 
router.post("/add-items", async (req, res) => {
    const items = req.body;
    await req.session.cart.saveCartToDatabase(items);
    res.json({message: "Request saved successfully"});
});

router.patch("/update-cart", async (req, res) => {
    await req.session.cart.updateCart(req.body);
    res.json({message: "Request successfully updated"})
});

router.delete("/delete-items", async (req, res) => {
    await req.session.cart.deleteFromCart(req.body);
    res.json({message: "Items successfully deleted"});
});

module.exports = router;