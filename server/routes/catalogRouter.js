const express = require('express');
const path = require('path');
const Catalog = require("../database/models/Catalog");

const router = express.Router();
const catalog = new Catalog();

router.use(express.json());

router.get("/get-catalog", async (req, res) => {
    const catalogList = await catalog.getCatalog();
    res.json(catalogList);
}) 
 
module.exports = router; 