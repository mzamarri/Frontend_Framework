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

app.get("/", (req, res) => {
    const sessionId = req.session.id;
    if (!(sessionId in Cart.sessionCarts)) Cart.newSession(sessionId);  
    res.sendFile(path.resolve(__dirname, "../app/index.html"));
});

app.use(routes);

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.post("/checkout", (req, res) => {
    console.log("/checkout POST");
    res.redirect("/");
}); 

app.listen(4600, () => {
    console.log("Server is running on port 4600");
});
