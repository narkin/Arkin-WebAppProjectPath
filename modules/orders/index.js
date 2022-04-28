// Project Path Assignment : MongoDB & Webapps
// Order Management Module
// Nate Arkin

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
const client = new MongoClient('mongodb://localhost');
const bodyParser = require('body-parser')


const app = module.exports = express();
app.use(bodyParser.json())

app.put('/api/order', (req, res) => {
    recordOrder(req.body.userID, req.body.orderInformation).then(function () { res.sendStatus(418) });
})

async function recordOrder(username, orderInformation) {
    try {
        console.log(orderInformation);
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('CustomerOrders');
        const date = new Date();
        const recordOrder = await db.insertOne({
            userID: username,
            date: `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            order: orderInformation
        })
        console.log(recordOrder)
    } catch (err) {
        return { success: false, err: err }
    }
}