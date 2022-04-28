// Project Path Assignment : MongoDB & Webapps
// webServer.js
// Nate Arkin

const express = require('express');
const port = 5050;
const path = require('path');

const app = express();

// This file is the main app router. 

// Here we require and use all the applications modules:
const ui = require('./ui');
app.use(ui);

const productsAPI = require('./modules/products');
app.use(productsAPI);

const authAPI = require('./modules/auth');
app.use(authAPI);

// Listen for TCP connections at our web server:
app.listen(port, () => {
    console.info(`Server is listening at http://localhost:${port}/`);
})