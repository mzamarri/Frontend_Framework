const express = require('express');
const path = require('path');

const app = express();

console.log("Static files are served from: ", path.resolve(__dirname, "../app/static/"));

app.use("/static", express.static(path.resolve(__dirname, "../app/static/")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../app/index.html"));
})

app.listen(4600, () => {
    console.log("Server is running on port 4600")
});