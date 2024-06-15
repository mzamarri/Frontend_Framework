const express = require('express');
const path = require('path');
const Cart = require("./ShoppingCart.js");
const OrderHistory = require("./OrderHistory.js");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../app/index.html"));
})

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
})

app.get("/cart", (req, res) => {
    console.log("/cart GET");
    res.redirect("/");
});

app.post("/cart", (req, res) => {
    console.log("/cart POST");
    res.redirect("/");
});

app.listen(4600, () => {
    console.log("Server is running on port 4600");
}); 
