const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes');
const Cart = require('./Cart');

const app = express(); 

app.use(session({
    secret: "MySecretVeryVerySecreyKey"
}))

app.use((req, res, next) => {
    if (!req.session.shoppingCart) {
        req.session.shoppingCart = new Cart();
    }
    next();
})

app.use(routes);

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
})

app.listen(4600, () => {
    console.log("Server is running on port 4600");
}); 