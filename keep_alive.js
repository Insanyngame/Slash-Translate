const express = require('express');
const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.send("The bot is online");
})

app.listen(8080)