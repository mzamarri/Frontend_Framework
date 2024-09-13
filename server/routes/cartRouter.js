const express = require('express');
const router = express.Router();

router.get(["/", "/get-items"], (req, res) => {
    const cartItems = req.session.cart.getCart();
    res.json({message: cartItems})
});
 
router.post("/add-items", (req, res) => {
    req.session.cart.addToCart(req.body);
}); 

module.exports = router;