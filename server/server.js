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
    // ISSUE: Cart object is being serialized when request are made via express-session. As a result
    // the type of data stored in session is not a Cart object anymore. Work in progress.
    if (req.session.cart == {}) return 1; 
    req.session.cart = new Cart(req.session.cart);
    next();
});

app.use(routes);

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
})

app.listen(4600, () => {
    console.log("Server is running on port 4600");
});  