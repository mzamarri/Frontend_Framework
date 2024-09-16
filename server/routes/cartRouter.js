const express = require('express');
const router = express.Router();

router.get(["/", "/get-items"], async (req, res) => {
    const cartItems = await req.session.cart.getCart();
    res.json(cartItems);
});
 
router.post("/add-items", (req, res) => {
    req.session.cart.addToCart(req.body);
    res.json({message: "Request saved successfully"});
}); 

module.exports = router;