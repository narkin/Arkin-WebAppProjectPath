// Project Path Assignment : MongoDB & Webapps
// UI router
// Nate Arkin

const express = require('express');
const path = require('path');

const app = module.exports = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/home.htm'));
})
app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname + '/ui.css'))
})

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname + '/catalog.htm'));
})
app.get('/catalog/js', (req, res) => {
    res.sendFile(path.join(__dirname + '/catalog.js'))
})

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname + '/cart.htm'))
})
app.get('/cart/js', (req, res) => {
    res.sendFile(path.join(__dirname + '/cart.js'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/loginregister.htm'))
})

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname + '/pastOrders.htm'))
})