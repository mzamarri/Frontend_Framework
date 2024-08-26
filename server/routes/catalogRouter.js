const express = require('express');
const path = require('path');
const Catalog = require("../database/models/Catalog");

const router = express.Router();
const catalog = new Catalog();

router.use(express.json());

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../app/index.html"));
})

router.get("/get-catalog", async (req, res) => {
    const catalogList = await catalog.getCatalog();
    res.json(catalogList);
})

router.post("/add-items", (req, res) => {
    req.session.cart.addToCart(req.body);
}) 
 
module.exports = router; 