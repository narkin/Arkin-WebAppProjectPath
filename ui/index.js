// Project Path Assignment : MongoDB & Webapps
// UI router
// Nate Arkin

const express = require('express');
const path = require('path');

const app = module.exports = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/home.htm'));
})

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname + '/catalog.htm'));
})