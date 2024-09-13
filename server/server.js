const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes');
const Cart = require('../server/database/models/Cart');

const app = express(); 

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "MySecretVeryVerySecreyKey"
}));

<<<<<<< HEAD
app.get("/", (req, res) => {
    const sessionId = req.session.id;
    if (!(sessionId in Cart.sessionCarts)) Cart.newSession(sessionId);  
    res.sendFile(path.resolve(__dirname, "../app/index.html"));
=======
app.use((req, res, next) => {
    // ISSUE: Cart object is being serialized when request are made via express-session. As a result
    // the type of data stored in session is not a Cart object anymore. Work in progress.
    if (req.session.cart == {}) return 1; 
    req.session.cart = new Cart(req.session.cart);
    next();
>>>>>>> 990faf1aef95baf89d89608b3eac465b3c6985b1
});

app.use(routes);

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
}); 

app.listen(4600, () => {
    console.log("Server is running on port 4600");
<<<<<<< HEAD
});
=======
});  
>>>>>>> 990faf1aef95baf89d89608b3eac465b3c6985b1
