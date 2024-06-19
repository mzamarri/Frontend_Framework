const express = require('express');
const path = require('path');
const Cart = require("./Cart.js");
const OrderHistory = require("./OrderHistory.js");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
})

app.get("/cart/get-items", (req, res) => {
    console.log("/cart/get-items GET");
    res.send({
        "3": {
            amount: 1,
            cartItem: {
                name: "Product 3",
                price: 75.00,
                imageSrc: "#",
                description: "Product 3 description"
            }
        }
    });
})

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../app/index.html"));
})

app.listen(4600, () => {
    console.log("Server is running on port 4600");
}); 
